import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Initialize tracking history with test events
    Args: event with httpMethod
          context with request_id attribute
    Returns: HTTP response with created history
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': 'Only POST method allowed'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id FROM packages WHERE tracking_code = 'AB2024789456'")
        package = cur.fetchone()
        
        if not package:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': False, 'error': 'Package not found'})
            }
        
        package_id = package['id']
        
        cur.execute("DELETE FROM tracking_history WHERE package_id = %s", (package_id,))
        
        events = [
            (package_id, 'Guangzhou Distribution Center, China', 'Package received', 'Package received from sender', datetime(2025, 11, 18, 10, 0, 0)),
            (package_id, 'Guangzhou International Airport, China', 'Departed', 'Departed from origin country', datetime(2025, 11, 18, 22, 30, 0)),
            (package_id, 'Frankfurt Airport, Germany', 'Arrived', 'Arrived at destination country', datetime(2025, 11, 20, 8, 15, 0)),
            (package_id, 'Frankfurt Sorting Center, Germany', 'In transit', 'Package sorted for delivery', datetime(2025, 11, 21, 14, 45, 0)),
            (package_id, 'Lalling Delivery Station, Germany', 'Out for delivery', 'Package is out for delivery', datetime(2025, 11, 22, 10, 0, 0)),
            (package_id, 'Alte Straße 2, 94551 Lalling, Germany', 'Delivered', 'Package delivered successfully', datetime(2025, 11, 22, 15, 30, 0)),
        ]
        
        for event in events:
            cur.execute(
                """INSERT INTO tracking_history 
                (package_id, location, status, description, event_date)
                VALUES (%s, %s, %s, %s, %s)""",
                event
            )
        
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': f'{len(events)} events added'})
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': str(e)})
        }
    
    finally:
        cur.close()
        conn.close()
