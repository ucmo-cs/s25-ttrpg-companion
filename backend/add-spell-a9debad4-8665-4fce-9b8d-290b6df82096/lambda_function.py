import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-spells')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    print("Adding Spell:", body)

    spell_name = body['spell_name']
    casting_time = body['casting_time']
    components = body['components']
    description = body['description']
    duration = body['duration']
    spell_range = body['range']
    school = body['school']
    level = body['level']
    class_name = body['class']


    try:
        table.put_item(Item = {
            "spell_name" : spell_name,
            "casting_time" : casting_time,
            "components" : components,
            "description" : description,
            "duration" : duration,
            "range" : spell_range,
            "school" : school,
            "level" : level,
            "class" : class_name
        })

        return {
            'statusCode': 200,
            'body': json.dumps('Succeeded adding character!')
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error adding character!')
        }
