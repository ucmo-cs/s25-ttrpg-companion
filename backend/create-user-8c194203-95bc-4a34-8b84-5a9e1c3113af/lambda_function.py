import json
import boto3
import uuid
import hashlib
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ttrpg-senior-project-users')

def lambda_handler(event, context):
    #Get information from request
    user = json.loads(event["body"])

    #Ensure email is valid and isn't tied to a user already
    emailCheck = checkEmail(user["email"])
    if (emailCheck):
        return emailCheck


    #Generate uid and date created
    uid = str(uuid.uuid4())
    
    #Generate salt and hash password
    salt = os.urandom(16)
    salted_password = user["password"].encode() + salt

    hash_object = hashlib.sha256(salted_password)
    hashed_password = hash_object.hexdigest()
    print("Hashed Password:", hashed_password)

    #Add user to database table
    try:
        table.put_item(Item = {
            "user_uid" : uid,
            "salt" : salt.hex(),
            "username" : user["username"],
            "email" : user["email"],
            "password" : hashed_password,
            "date_created" : datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        })
        return {
            'statusCode': 200,
            'body': json.dumps({
                "message" : "User Created Sucessfully",
                "user_uid" : uid
            })
        }
    #exception trying to add to database
    except Exception as e:
        print("Exception:", e)
        return {
            'statusCode': 402,
            'body': json.dumps('Error Adding User to Database')
        }

def checkEmail(email):
    #Make sure email is valid
    print("Email:", email)
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
