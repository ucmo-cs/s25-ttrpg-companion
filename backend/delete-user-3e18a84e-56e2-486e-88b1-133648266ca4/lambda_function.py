import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ttrpg-senior-project-users")
character_table = dynamodb.Table("ttrpg-senior-project-characters")

def lambda_handler(event, context):
    #Get information from the request
    body = json.loads(event["body"])

    session_token = event["headers"]["session_token"]
    if(checkSessionToken(body["user_uid"], session_token) == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    #Try deleting user-uid object from database
    try:
        response = table.delete_item(
            Key = {"user_uid" : body["user_uid"]},
            ReturnValues = "ALL_OLD"
        )

        #No user found with user uid
        if not "Attributes" in response:
            return {
                'statusCode' : 404,
                "body" : json.dumps("User Not Found")
            }

        #User sucessfully deleted
        else:
            #Delete Characters for that user
            characters = character_table.query(
                KeyConditionExpression = "user_uid = :user_uid",
                ExpressionAttributeValues = {":user_uid" : body["user_uid"]}
            )
            #Characters found, loop through and delete
            if "Items" in characters:
                for character in characters["Items"]:
                    character_table.delete_item(Key = {
                        "user_uid" : body["user_uid"],
                        "character_uid" : character["character_uid"],
                    })
            print("Characters:", characters)
            return {
                'statusCode' : 200,
                "body" : json.dumps("User Deleted Sucessfully")
            }
    except Exception as e:
        print("Exception:", e)
        return {
            "statusCode" : 402,
            "body" : json.dumps("Error in Database deleting User")
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