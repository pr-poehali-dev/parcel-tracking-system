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
    conn = psycopg2.connect(dsn, cursor_factory=RealDictCursor)
    conn.autocommit = True
    return conn

def escape_sql_string(value):
    if value is None:
        return 'NULL'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        return "'" + value.replace("'", "''") + "'"
    return 'NULL'

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
                query = f"SELECT * FROM packages WHERE tracking_code = {escape_sql_string(tracking_code)}"
                cur.execute(query)
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
            tracking_code = data.get('tracking_code') or generate_tracking_code()
            
            query = f"""INSERT INTO packages 
                (tracking_code, sender_name, sender_address, recipient_name, recipient_address, 
                origin, destination, weight, status, estimated_delivery, notes, shipped_date, delivered_date)
                VALUES (
                    {escape_sql_string(tracking_code)},
                    {escape_sql_string(data.get('sender_name', ''))},
                    {escape_sql_string(data.get('sender_address', ''))},
                    {escape_sql_string(data.get('recipient_name', ''))},
                    {escape_sql_string(data.get('recipient_address', ''))},
                    {escape_sql_string(data.get('origin', ''))},
                    {escape_sql_string(data.get('destination', ''))},
                    {escape_sql_string(data.get('weight', 0))},
                    {escape_sql_string(data.get('status', 'pending'))},
                    {escape_sql_string(data.get('estimated_delivery'))},
                    {escape_sql_string(data.get('notes', ''))},
                    {escape_sql_string(data.get('shipped_date'))},
                    {escape_sql_string(data.get('delivered_date'))}
                )
                RETURNING *"""
            cur.execute(query)
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
            
            query = f"""UPDATE packages 
                SET sender_name = {escape_sql_string(data.get('sender_name'))},
                    sender_address = {escape_sql_string(data.get('sender_address'))},
                    recipient_name = {escape_sql_string(data.get('recipient_name'))}, 
                    recipient_address = {escape_sql_string(data.get('recipient_address'))}, 
                    origin = {escape_sql_string(data.get('origin'))},
                    destination = {escape_sql_string(data.get('destination'))},
                    weight = {escape_sql_string(data.get('weight'))},
                    status = {escape_sql_string(data.get('status'))},
                    estimated_delivery = {escape_sql_string(data.get('estimated_delivery'))},
                    notes = {escape_sql_string(data.get('notes', ''))},
                    shipped_date = {escape_sql_string(data.get('shipped_date'))},
                    delivered_date = {escape_sql_string(data.get('delivered_date'))},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = {escape_sql_string(package_id)}
                RETURNING *"""
            cur.execute(query)
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
            
            query = f"DELETE FROM packages WHERE id = {escape_sql_string(package_id)} RETURNING id"
            cur.execute(query)
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