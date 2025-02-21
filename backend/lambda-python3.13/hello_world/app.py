import json
import boto3

# import requests


def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    jsonString = json.dumps({
        "key" : "ricketsonblake@gmail.com",
        "name" : "Blake Ricketson",
        "password" : "Block"
    })

    print("Json string:", jsonString)

    with open("/tmp/tempfile.json", "w") as tempFile:
        tempFile.write(jsonString)

    print("tempFile written into sucessfully")

    # s3_client = boto3.client("s3",
    #     endpoint_url = "http://localhost:4566",
    #     aws_access_key_id = "test",
    #     aws_secret_access_key = "test",
    #     region_name='us-east-2')

    # response = s3_client.list_buckets()
    # print("Buckets:", [bucket["Name"] for bucket in response["Buckets"]])

    # s3_client.upload_file("./tmp/tempfile.json", "ttrpg-bucket", "ricketson.json")
    # print("Sucessfully Uploaded File")


    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello " + event["name"],
            # "location": ip.text.replace("\n", "")
        }),
    }
