import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-characters')

def lambda_handler(event, context):
    #Get infomation from the request
    body = json.loads(event["body"])
    user_uid = body["user_uid"]

    #Ensure the uid exists for the user
    if not userUidExists(user_uid):
        return {
            'statusCode': 400,
            'body': json.dumps("User UID does not exist")
        }    

    session_token = event["headers"]["session_token"]
    new_session_token = checkSessionToken(user_uid, session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    #Generate new uid for character
    uid = str(uuid.uuid4())

    #Use new uid to put character in database table
    try:
        table.put_item(Item = {
            "user_uid" : user_uid,
            "character_uid" : uid,
            "character_name" : body["character"]["name"],
            "character" : json.dumps(body["character"]),
            "date_created" : datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        })

        return {
            'statusCode': 200,
            'body': json.dumps({
                "message" : "Character Created Sucessfully",
                "character_uid" : uid,
                "session_token" : new_session_token
            })
        }
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps("Database error creating character")
        }

#If the response isn't null the uid exists in the table
def userUidExists(user_uid):
    if "Item" in dynamodb.Table("ttrpg-senior-project-users").get_item(Key = {"user_uid" : user_uid}):
        return True
    return False

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
    print("Response Payload:", response_payload)
    if(response_payload["statusCode"] != 200):
        print("Status Code Not 200 in response_payload")
        return None
    return response_payload["body"]["session_token"]