import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для истории отслеживания
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            package_id = event.get('queryStringParameters', {}).get('package_id')
            
            if not package_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'package_id is required'})
                }
            
            cur.execute(
                "SELECT * FROM t_p50689379_parcel_tracking_syst.tracking_history WHERE package_id = %s ORDER BY event_date DESC",
                (package_id,)
            )
            history = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'history': [dict(h) for h in history]}, default=str)
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """INSERT INTO t_p50689379_parcel_tracking_syst.tracking_history 
                (package_id, location, status, description, event_date)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *""",
                (
                    data.get('package_id'),
                    data.get('location', ''),
                    data.get('status', ''),
                    data.get('description', ''),
                    data.get('event_date')
                )
            )
            conn.commit()
            new_history = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'history': dict(new_history)}, default=str)
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            history_id = data.get('id')
            
            cur.execute(
                """UPDATE t_p50689379_parcel_tracking_syst.tracking_history 
                SET location = %s,
                    status = %s,
                    description = %s,
                    event_date = %s
                WHERE id = %s
                RETURNING *""",
                (
                    data.get('location'),
                    data.get('status'),
                    data.get('description'),
                    data.get('event_date'),
                    history_id
                )
            )
            conn.commit()
            updated_history = cur.fetchone()
            
            if not updated_history:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'History entry not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'history': dict(updated_history)}, default=str)
            }
        
        elif method == 'DELETE':
            history_id = event.get('queryStringParameters', {}).get('id')
            
            cur.execute("DELETE FROM t_p50689379_parcel_tracking_syst.tracking_history WHERE id = %s RETURNING id", (history_id,))
            conn.commit()
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'History entry not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()