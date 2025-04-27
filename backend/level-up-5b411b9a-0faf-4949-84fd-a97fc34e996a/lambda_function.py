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
    body["class"] = body["class"].lower()
    body["level"] = int(body["level"])


    session_token = event["headers"]["session_token"]
    print("Session Token:", session_token)
    new_session_token = checkSessionToken(body["user_uid"], session_token)
    if(new_session_token == None):
        return {
            'statusCode': 405,
            'body': json.dumps('Session Token Invalid')
        }

    
    try:
        response = table.get_item(Key = {
            "class" : body["class"],
            "level" : body["level"]
        })

        if not "Item" in response:
            return {
                'statusCode': 405,
                'body': json.dumps('Class or Level not found')
            }

        #Get the spell level from response
        info = response["Item"]
        info["level"] = body["level"]
        print("Info:", info)

        # Get spell descriptions
        spells = getSpells(info.pop("spell_names"), body["class"], body["level"])

        #Get spell for specific subspecies at level 3 and 5
        if (body["level"] == 3 or body["level"] == 5) and "subspecies" in body:
            print("Checking for subspecies Spell")
            spell = getSubspeciesSpell(body["subspecies"].lower().replace(" ", "_"), body["level"])
            if spell != None:
                print("Subspecies Spell Found:", spell)
                info["subspecies_spell"] = {}
                info["subspecies_spell"][spell.pop("spell_name")] = spell

        #Get feature Descriptions
        features = getFeatures(info.pop("features"), body["class"])

        creation_features = {}
        #Get character creation options
        if info["level"] == 1:
            creation_features = getCreationFeatures(body["class"])

        #Parse strings into ints
        info["cantrips _known"] = int(info["cantrips_known"])
        info["proficiency_bonus"] = int(info["proficiency_bonus"])
        info["spell_slots"] = [int(x) for x in info["spell_slots"]]

        #print("Spells:", spells)

        return {
            'statusCode': 200,
            'body': json.dumps({
                "info" : info,
                "spells" : spells,
                "features" : features,
                "creation_features" : creation_features,
                "session_token" : new_session_token
            })
        }

    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error searching in database')
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

#Get all available spells from the other dynamo table
def getSpells(spell_list, class_name, level):
    spells_json = {}

    response = spell_table.query(
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
                ":class_name" : class_name,
                ":character_level" : level
            }
        )
    print("Response:", response)
    for item in response["Items"]:
        spell_name = item.pop("spell_name")
        item["level"] = str(item["level"])
        spells_json[spell_name] = item

    return spells_json

#Get a spell for certain subspecies when they reach level 3 and level 5
def getSubspeciesSpell(subspecies, level):
    spells_response = table.get_item(Key = {
        "class" : "species",
        "level" : level
    })
    if "Item" in spells_response:
        spells = spells_response["Item"]["spells"]
        print("Spells returned in species search:", spells)
        if subspecies in spells:
            spell = spell_table.get_item(Key = {
                "spell_name" : spells[subspecies],
                "class" : "species"},
                ProjectionExpression = "spell_name, #spell_level, school, casting_time, #spell_range, components, #spell_duration, description",
                ExpressionAttributeNames = {
                    "#spell_level" : "level",
                    "#spell_range" : "range",
                    "#spell_duration" : "duration"
                })["Item"]
            spell["level"] = int(spell["level"])
            return spell
    return None

def getFeatures(feature_list, class_name):
    features_json = {}
    for feature in feature_list:
        if(feature == "Arcane Tradition Feature"):
            features_json[feature] = "Feature from Subclass"
            continue
        features_json[feature] = feature_table.get_item(Key = {
            "class" : class_name,
            "feature_name" : feature
        })["Item"]["description"]
    return features_json

def getCreationFeatures(class_name):
    creation_features = feature_table.get_item(Key = {
        "class" : class_name,
        "feature_name" : "Creation"
    })["Item"]

    return creation_features