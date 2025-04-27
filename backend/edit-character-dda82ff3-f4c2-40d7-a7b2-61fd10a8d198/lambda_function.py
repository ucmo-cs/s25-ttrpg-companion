import json
import boto3
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ttrpg-senior-project-characters")

def lambda_handler(event, context):
    #Get information from request
    body = json.loads(event["body"])
    if "user_uid" not in body or "character_uid" not in body:
        return {
            "statusCode" : 422,
            "body" : json.dumps("Missing user_uid or character_uid")
        }
    if "character" not in body:
        return {
            "statusCode" : 422,
            "body" : json.dumps("Missing character key value")
        }

    user_uid = body["user_uid"]
    character_uid = body["character_uid"]

    #If no character exists with the user/character uid's return a 404
    try:
        if not "Item" in table.get_item(Key = {"user_uid": user_uid,"character_uid": character_uid}):
            return {
                "statusCode" : 404,
                "body" : json.dumps("Character Not Found")
            }
    except Exception as e:
        print("Exception:", e)
        return {
            "statusCode" : 402,
            "body" : json.dumps("Invalid user_uid or character_uid")
        }

    session_token = event["headers"]["session_token"]
    new_session_token = checkSessionToken(user_uid, session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    #Update character now that we know it exists in the database
    try:
        response = table.update_item(
            Key = {
                "user_uid" : user_uid,
                "character_uid" : character_uid
            },
            ReturnValues = "UPDATED_NEW",
            UpdateExpression = "SET #charaname = :charaname, #chara = :chara, #editdate = :editdate",
            ExpressionAttributeNames = {
                "#charaname" : "character_name",
                "#chara" : "character",
                "#editdate" : "date_modified"
            },
            ExpressionAttributeValues = {
                ":charaname" : body["character"]["name"],
                ":chara" : json.dumps(body["character"]),
                ":editdate" : datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            }
        )
        
        #Return successful message
        print("Response:", response)
        return {
            "statusCode" : 200,
            "body" : json.dumps({
                "message" : "Character Edited Successfully",
                "session_token" : new_session_token
            })
        }

    except Exception as e:
        print("Exception:", e)
        return {
            "statusCode" : 402,
            "body" : json.dumps("Error in database editing character")
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