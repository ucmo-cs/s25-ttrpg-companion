import json
import boto3

lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-species')
spell_table = dynamodb.Table('ttrpg-senior-project-spells')

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

    species_to_get = ["Dragonborn", "Drawf", "Elf", "Goliath", "Gnome", "Halfling", "Human", "Orc", "Tiefling"]
    try: 
        species_json = {}
        for species in species_to_get:
            response = table.get_item(Key = {
                "species_name" : species
            })
            if "Item" in response:
                response["Item"].pop("species_name")
                species_json[species] = response["Item"]
            
            #print("Response: ", species_json[species])
            if "spells" in species_json[species]:
                print("Getting Spells")
                spells_json = {}
                for spell in species_json[species]["spells"]:
                    spell_response = spell_table.get_item(Key = {
                        "spell_name" : spell,
                        "class" : "species"},
                        ProjectionExpression = "spell_name, #spell_level, school, casting_time, #spell_range, components, #spell_duration, description",
                        ExpressionAttributeNames = {
                            "#spell_level" : "level",
                            "#spell_range" : "range",
                            "#spell_duration" : "duration"})
                    if "Item" in spell_response:
                        spells_json[spell] = spell_response["Item"]
                        spells_json[spell]["level"] = str(spell_response["Item"]["level"])
                print("Spells JSON: ", spells_json)
                species_json[species]["spells"] = spells_json

        return {
            'statusCode': 200,
            'body': json.dumps(species_json)
        }

    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error searching for species')
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
