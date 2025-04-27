import json
import boto3
import hashlib
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-users')

def lambda_handler(event, context):
    #Get information from request
    body = json.loads(event["body"])
    email = body["email"]

    #Ensure email is valid 
    if not '@' in email or not '.' in email:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid Email Address')
        }

    #Get response based on if the user entered an email or username
    try:
        response = table.query(
            IndexName = "email-index",
            KeyConditionExpression = "email = :email",
            ExpressionAttributeValues = {
                ":email" : email
            }
        )

        if response["Count"] == 0:
            return {
                'statusCode': 404,
                'body': json.dumps('Email Address Not Found')
            }

        #Check through response users for a correct password
        for user in response["Items"]:
            #Salt and hash password, then check against existing password
            if(checkPassword(user, body["password"])):
                user["characters"] = getCharacters(user)
                session_token = createSession(user["user_uid"])

                if(session_token == None):
                    return {
                        'statusCode': 405,
                        'body': json.dumps('Error Creating Session')
                    }

                #Remove salt before returning user
                del user["salt"]
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'user' : user,
                        'session_token' : session_token
                    })
                }
        return {
            'statusCode': 401,
            'body': json.dumps('Incorrect Password')
        }      
        
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error Searching Database')
        }
    
def checkPassword(user, password):
    salted_password = password.encode() + bytes.fromhex(user["salt"])

    hash_object = hashlib.sha256(salted_password)
    hashed_password = hash_object.hexdigest()
    return hashed_password == user["password"]

def getCharacters(user):
    character_table = dynamodb.Table('ttrpg-senior-project-characters')

    response = character_table.query(
        Select = "SPECIFIC_ATTRIBUTES",
        ProjectionExpression = "#name, #uid",
        KeyConditionExpression = Key("user_uid").eq(user["user_uid"]),
        ExpressionAttributeNames = {
            "#name" : "character_name",
            "#uid" : "character_uid"
        }
    )
    return (response["Items"])

def createSession(user_uid):

    # Initialize the Lambda client
    lambda_client = boto3.client('lambda')

    # Define the payload for create-session
    payload = {
        'user_uid': user_uid,
    }

    # Invoke the target Lambda function
    try:
        response = lambda_client.invoke(
            FunctionName='create-session',
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