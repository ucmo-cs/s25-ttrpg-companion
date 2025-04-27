import json
import boto3
import base64

s3 = boto3.client("s3")
bucket = "ttrpg-senior-project-images"

def lambda_handler(event, context):
    #Pull headers from event
    headers = event["headers"]
    extension = json.loads(event["body"])["extension"]

    #Validate Session Token
    new_session_token = checkSessionToken(headers["user_uid"], headers["session_token"])
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    #Generate s3 key
    key = headers["user_uid"] + "_" + headers["character_uid"]

    # Pull image from s3 bucket
    try:
        response = s3.get_object(Bucket=bucket, Key=key)

        # Handle either incorrect uid's or a character without a profile picture
        if not "Body" in response:
            return {
                "statusCode": 401,
                "body": json.dumps("No Profile Picture")
            }


        return {
            "statusCode" : 200,
            "headers" : {
                "content-type": "image/" + extension,
                "session_token" : new_session_token
            },
            "body": base64.b64encode(response["Body"].read()),
            "isBase64Encoded" : True
        }

    except Exception as e:
        print("Exception: ", e)
        return {
            "statusCode": 402,
            "body": json.dumps("Error retrieving object from bucket")
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