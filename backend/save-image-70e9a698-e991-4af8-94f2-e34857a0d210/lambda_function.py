import json
import boto3
import base64

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ttrpg-senior-project-characters")
bucket = "ttrpg-senior-project-images"

def lambda_handler(event, context):
    #Pull information from event
    headers = event["headers"]

    #If no character exists with the user/character uid's return a 404
    try:
        if not "Item" in table.get_item(Key = {"user_uid": headers["user_uid"],"character_uid": headers["character_uid"]}):
            return {
                "statusCode" : 404,
                "body" : json.dumps("Character Not Found")
            }
    except Exception as e:
        print("Exception:", e)
        return {
            "statusCode" : 402,
            "body" : json.dumps("Error in database validating uid's")
        }

    #Validate Session_token
    session_token = headers["session_token"]
    new_session_token = checkSessionToken(headers["user_uid"], session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    #Get extension based on content-type
    extension = None
    print("Content-Type:", headers["content-type"])
    match(headers["content-type"]):
        case "image/png":
            extension = ".png"
        case "image/jpeg":
            extension = ".jpeg"
        case "image/webp":
            extension = ".webp"
        case _:
            return {
                'statusCode': 401,
                'body': json.dumps('Invalid Content-Type')
            }

    #Create Key
    key = headers["user_uid"] + "_" + headers["character_uid"]
    try:
        response = s3.put_object(Bucket=bucket, Key=key, Body=base64.b64decode(event["body"]))

        table.update_item(
            Key = {
                "user_uid" : headers["user_uid"],
                "character_uid" : headers["character_uid"]
            },
            ReturnValues = "UPDATED_NEW",
            UpdateExpression = "SET picture_extention = :picExt",
            ExpressionAttributeValues = {
                ":picExt" : extension
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                "message" : "Image Successfully Saved",
                "file_name" : key,
                "session_token" : new_session_token
            })
        }
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error putting object in s3')
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