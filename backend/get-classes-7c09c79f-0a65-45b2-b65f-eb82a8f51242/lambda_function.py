import json
import boto3

lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-class-magic')
spell_table = dynamodb.Table('ttrpg-senior-project-spells')
feature_table = dynamodb.Table('ttrpg-senior-project-features')

def lambda_handler(event, context):
    #Get information from event
    body = json.loads(event["body"])


    session_token = event["headers"]["session_token"]
    print("Session Token:", session_token)
    new_session_token = checkSessionToken(body["user_uid"], session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    classes_to_get = ["fighter", "wizard"]
    try: 
        class_json = {}
        for class_ in classes_to_get:
            #Pull each class from class-magic and features
            response = table.get_item(Key = {
                "class" : class_,
                "level" : 1
            })

            print("Response:", response)
            if "Item" in response:
                response["Item"].pop("level")
                response["Item"].pop("class")
                class_json[class_] = response["Item"]
            
            spells_json = {}
            spells_response = spell_table.query(
                IndexName = "class-level-index",
                Select = "SPECIFIC_ATTRIBUTES",
                KeyConditionExpression = "#class_name = :class_name and #character_level <= :character_level",
                ProjectionExpression = "spell_name, #spell_level, school, casting_time, #spell_range, components, #spell_duration, description",
                ExpressionAttributeNames = {
                    "#class_name" : "class",
                    "#character_level" : "level",
                    "#spell_level" : "level",
                    "#spell_range" : "range",
                    "#spell_duration" : "duration"
                },
                ExpressionAttributeValues = {
                    ":class_name" : "creation",
                    ":character_level" : 1
                }
            )
            for item in spells_response["Items"]:
                item["level"] = str(item["level"])
                level_string = "Level " + item["level"]
                if not level_string in spells_json:
                    spells_json[level_string] = {}
                spell_name = item.pop("spell_name")
                spells_json[level_string][spell_name] = item

        return {
            'statusCode': 200,
            'body': json.dumps({
                'classes' : class_json,
                'spells' : spells_json,
                'session_token' : new_session_token
            })
        }


    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error Getting Classes')
        }



def checkSessionToken(user_uid, session_token):
    
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
