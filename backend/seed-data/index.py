import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Initialize database with test package data
    Args: event with httpMethod
          context with request_id attribute
    Returns: HTTP response with created package info
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
        shipped_date = datetime(2025, 11, 18, 10, 0, 0)
        delivered_date = datetime(2025, 11, 22, 15, 30, 0)
        estimated_delivery = '2025-11-22'
        
        cur.execute("UPDATE packages SET shipped_date = %s, delivered_date = %s WHERE tracking_code = 'AB2024789456'", (shipped_date, delivered_date))
        conn.commit()
        
        cur.execute("SELECT * FROM packages WHERE tracking_code = 'AB2024789456'")
        package = cur.fetchone()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'package': dict(package)}, default=str)
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