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
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage packages - create, read, update, delete package tracking records
    Args: event with httpMethod, body, queryStringParameters
          context with request_id attribute
    Returns: HTTP response with package data in English
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
                    "SELECT * FROM packages WHERE tracking_code = %s",
                    (tracking_code,)
                )
                package = cur.fetchone()
                
                if not package:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': False, 'error': 'Package not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'package': dict(package)}, default=str)
                }
            else:
                cur.execute("SELECT * FROM packages ORDER BY created_at DESC")
                packages = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'packages': [dict(p) for p in packages]}, default=str)
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            tracking_code = generate_tracking_code()
            
            cur.execute(
                """INSERT INTO packages 
                (tracking_code, sender_name, sender_address, recipient_name, recipient_address, 
                origin, destination, weight, status, estimated_delivery, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *""",
                (
                    tracking_code,
                    data.get('sender_name', ''),
                    data.get('sender_address', ''),
                    data.get('recipient_name', ''),
                    data.get('recipient_address', ''),
                    data.get('origin', ''),
                    data.get('destination', ''),
                    data.get('weight', 0),
                    data.get('status', 'pending'),
                    data.get('estimated_delivery'),
                    data.get('notes', '')
                )
            )
            conn.commit()
            new_package = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'package': dict(new_package)}, default=str)
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            package_id = data.get('id')
            
            cur.execute(
                """UPDATE packages 
                SET sender_name = %s,
                    sender_address = %s,
                    recipient_name = %s, 
                    recipient_address = %s, 
                    origin = %s,
                    destination = %s,
                    weight = %s,
                    status = %s,
                    estimated_delivery = %s,
                    notes = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *""",
                (
                    data.get('sender_name'),
                    data.get('sender_address'),
                    data.get('recipient_name'),
                    data.get('recipient_address'),
                    data.get('origin'),
                    data.get('destination'),
                    data.get('weight'),
                    data.get('status'),
                    data.get('estimated_delivery'),
                    data.get('notes', ''),
                    package_id
                )
            )
            conn.commit()
            updated_package = cur.fetchone()
            
            if not updated_package:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Package not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'package': dict(updated_package)}, default=str)
            }
        
        elif method == 'DELETE':
            package_id = event.get('queryStringParameters', {}).get('id')
            
            cur.execute("DELETE FROM packages WHERE id = %s RETURNING id", (package_id,))
            conn.commit()
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Package not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
