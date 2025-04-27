import json
import boto3
from datetime import datetime, timedelta
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-sessions')

def lambda_handler(event, context):
    # Extract session data from the event (e.g., user ID, session token)
    user_uid = event["user_uid"]

    # Generate session_token
    session_token = str(uuid.uuid4())

    # Calculate TTL for 1 hour from now
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    ttl = int(expiration_time.timestamp())

    try:
        # Store session data in DynamoDB with TTL
        response = table.update_item(
            Key = {
                "user_uid" : user_uid
            },
            ReturnValues = "UPDATED_NEW",
            UpdateExpression = "SET session_token = :session_token, expirationTime = :expirationTime",
            ExpressionAttributeValues = {
                ":session_token" : session_token,
                ":expirationTime" : ttl
            }
        )

        return {
            'statusCode' : 200,
            'body': {
                'message' : 'Session created successfully',
                'session_token' : session_token
            }
        }

    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode' : 402,
            'body' : 'Database error creating session'
        }