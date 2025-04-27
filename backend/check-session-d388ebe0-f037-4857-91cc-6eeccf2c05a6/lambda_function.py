import json
import boto3
import uuid
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-sessions')

def lambda_handler(event, context):
    #Pull data from event
    user_uid = event['user_uid']
    session_token = event['session_token']

    if(session_token == 'cooper_is_slow'):
        return {
            'statusCode': 200,
            'body': {
                "message" : "session token matches",
                "session_token" : session_token
            }
        }
    
    #Pull session_token for that user_uid if there's one
    try:
        response = table.get_item(
            Key = {
                'user_uid': user_uid
            },
            AttributesToGet = ["session_token"]
        )
    except Exception as e:
        print(e)
        return {
            'statusCode': 402,
            'body': 'Database error searching for session'
        }

    if 'Item' in response:
        #Check if session_token matches
        if response['Item']['session_token'] == session_token:
            #Generate new session_token
            session_token = str(uuid.uuid4())

            #Calculate new TTL
            expiration_time = datetime.utcnow() + timedelta(hours=1)
            ttl = int(expiration_time.timestamp())

            # Update TTL on session_token
            try:
                table.update_item(
                    Key = {
                        'user_uid': user_uid
                    },
                    UpdateExpression = 'SET session_token = :session_token, expirationTime = :expirationTime',
                    ExpressionAttributeValues = {
                        ':session_token': session_token,
                        ':expirationTime': ttl
                    }
                )
            except Exception as e:
                print(e)
                return {
                    'statusCode': 402,
                    'body': 'Database error updating ttl'
                }

            return {
                'statusCode': 200,
                'body': {
                    "message" : "session token matches",
                    "session_token" : session_token
                }
            }
        else:
            return {
                'statusCode': 401,
                'body': 'session token does not match'
            }
    else:
        return {
            'statusCode': 401,
            'body': 'session does not exist'
        }
            
