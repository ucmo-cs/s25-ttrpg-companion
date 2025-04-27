import json
import boto3
import hashlib
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ttrpg-senior-project-users")

def lambda_handler(event, context):
    #Get information from the request
    print("Event:", event)
    user = json.loads(event["body"])

    #Pull information from the user
    user_uid = user["user_uid"]
    username = user["username"]
    old_password = user["old_password"]
    new_password = user["new_password"]
    email = user["email"]


    #Pull existing user information
    try:
        old_user = table.get_item(Key = {"user_uid" : user_uid})["Item"]
        print("Old User:", old_user)
        if not old_user:
            return {
                'statusCode': 404,
                'body': json.dumps('User Not Found')
            }
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error in database getting old user')
        }

    session_token = event["headers"]["session_token"]
    print("Session Token:", session_token)
    new_session_token = checkSessionToken(user_uid, session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }


    #If not same email, check to make sure the email is valid
    if not old_user["email"] == email:
        #Ensure email is valid and isn't tied to a different user already
        emailCheck = checkEmail(user["email"])
        if (emailCheck):
            return emailCheck


    #Hash and check oldPassword against stored password
    if not hashPassword(old_user["salt"], old_password) == old_user["password"]:
        return {
            'statusCode': 401,
            'body': json.dumps('Incorrect Old Password')
        }

    #Hash new password with same salt
    new_hashed_password = hashPassword(old_user["salt"], new_password)
    
    #Put new object in the database
    try: 
        response = table.update_item(
            Key = {
                "user_uid" : user_uid
            },
            ReturnValues = "UPDATED_NEW",
            UpdateExpression = "SET username = :username, password = :password, email = :email, #editdate = :editdate",
            ExpressionAttributeNames = {
                "#editdate" : "date_modified"
            },
            ExpressionAttributeValues = {
                ":username" : username,
                ":password" : new_hashed_password,
                ":email" : email,
                ":editdate" : datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message' : 'User Updated Successfully',
                'session_token' : new_session_token
            })
        }

    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Database error updating user')
        }



def checkEmail(email):
    #Make sure email is valid
    if not '@' in email or not '.' in email:
        print("Invalid Email")
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid Email')
        }

    #Check for existing email
    try:
        if (table.query(
            IndexName = "email-index",
            KeyConditionExpression = "email = :email",
            ExpressionAttributeValues = {
                ":email" : email
            }
        )["Count"] > 0):
            return {
                'statusCode': 400,
                'body': json.dumps('Email Already Exists')
            }
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Database error in email search')
        }

    return null

#Salt and hash a password using sha256 with a given salt and password
def hashPassword(salt, password):
    salted_password = password.encode() + bytes.fromhex(salt)

    hash_object = hashlib.sha256(salted_password)
    return hash_object.hexdigest()

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