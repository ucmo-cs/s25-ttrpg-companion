import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-characters')

def lambda_handler(event, context):
    #Take information out of the request
    body = json.loads(event["body"])
    user_uid = body["user_uid"]
    
    #Pull the character having the user_uid and character_uid
    try:
        response = table.get_item(
            Key = {
                "user_uid": user_uid,
                "character_uid": body["character_uid"]
            }
        )

        #If the character doesn't exist, return an error
        if "Item" not in response:
            return {
                "statusCode": 404,
                "body": "Character Not Found"
            }
        
        #Put character_uid into character object
        responseItem = json.loads(response["Item"]["character"])
        responseItem["character_uid"] = body["character_uid"]

        session_token = event["headers"]["session_token"]
        new_session_token = checkSessionToken(user_uid, session_token)
        if(new_session_token == None):
            return {
                'statusCode': 405,
                'body': json.dumps('Session Token Invalid')
            }

        
        #Turn the character string back into json, then send
        return {
            "statusCode": 200,
            "body": json.dumps({
                "character" : responseItem,
                "session_token" : new_session_token
            })
        }
    except Exception as e:
        print("Exception:", e)
        return {
            "statusCode": 402,
            "body": "Database error searching for character"
        }

def checkSessionToken(user_uid, session_token):
    lambda_client = boto3.client('lambda')
    payload = {
        "user_uid" : user_uid,
        "session_token" : session_token
    }

    # Invoke the target Lambda function
    try:
        response = lambda_client.invoke(
            FunctionName='check-session',
            InvocationType='RequestResponse',
            Payload=json.dumps(payload)
        )
    except Exception as e:
        print("Exception:", e)
        return None


    # Process the response
    response_payload = json.loads(response['Payload'].read())
    if(response_payload["statusCode"] != 200):
        print("Status Code Not 200 in response_payload")
        return None
    return response_payload["body"]["session_token"]