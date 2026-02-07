import json
import os
import random
import string
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def generate_tracking_code() -> str:
    year = "2024"
    number = ''.join(random.choices(string.digits, k=6))
    return f"AB{year}{number}"

def get_db_connection():
    """Establish database connection"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage parcels - create, read, update, delete parcel tracking records
    Args: event with httpMethod, body, queryStringParameters, pathParams
          context with request_id attribute
    Returns: HTTP response with parcel data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            tracking_code = event.get('queryStringParameters', {}).get('tracking_code')
            
            if tracking_code:
                cur.execute(
                    "SELECT * FROM parcels WHERE tracking_code = %s",
                    (tracking_code,)
                )
                parcel = cur.fetchone()
                
                if not parcel:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Посылка не найдена'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(parcel), default=str)
                }
            else:
                cur.execute("SELECT * FROM parcels ORDER BY created_at DESC")
                parcels = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in parcels], default=str)
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            tracking_code = generate_tracking_code()
            
            cur.execute(
                """INSERT INTO parcels 
                (tracking_code, recipient_first_name, recipient_last_name, recipient_address, current_location, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *""",
                (
                    tracking_code,
                    data.get('recipient_first_name', ''),
                    data.get('recipient_last_name', ''),
                    data.get('recipient_address', ''),
                    data.get('current_location', 'Склад приёма'),
                    data.get('status', 'pending')
                )
            )
            conn.commit()
            new_parcel = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_parcel), default=str)
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            parcel_id = data.get('id')
            
            cur.execute(
                """UPDATE parcels 
                SET recipient_first_name = %s, 
                    recipient_last_name = %s, 
                    recipient_address = %s, 
                    current_location = %s, 
                    status = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *""",
                (
                    data.get('recipient_first_name'),
                    data.get('recipient_last_name'),
                    data.get('recipient_address'),
                    data.get('current_location'),
                    data.get('status'),
                    parcel_id
                )
            )
            conn.commit()
            updated_parcel = cur.fetchone()
            
            if not updated_parcel:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Посылка не найдена'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_parcel), default=str)
            }
        
        elif method == 'DELETE':
            parcel_id = event.get('queryStringParameters', {}).get('id')
            
            cur.execute("DELETE FROM parcels WHERE id = %s RETURNING id", (parcel_id,))
            conn.commit()
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Посылка не найдена'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()