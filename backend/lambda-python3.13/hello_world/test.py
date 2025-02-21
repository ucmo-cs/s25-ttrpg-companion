import boto3
import json

def main():
    jsonString = json.dumps({
        "key" : "ricketsonblake@gmail.com",
        "name" : "Blake Ricketson",
        "password" : "Block"
    })

    print("Json string:", jsonString)

    with open("./tmp/tempfile.json", "w") as tempFile:
        tempFile.write(jsonString)

    print("tempFile written into sucessfully")

    s3_client = boto3.client("s3",
        endpoint_url = "http://localhost:4566",
        aws_access_key_id = "test",
        aws_secret_access_key = "test",
        region_name='us-east-2')

    response = s3_client.list_buckets()
    # print("Response:", response)
    print("Buckets:", [bucket["Name"] for bucket in response["Buckets"]])

    content = s3_client.list_objects_v2(Bucket="ttrpg-bucket")
    # print("Response:", content)
    print("Keys:", [obj['Key'] for obj in content['Contents']])

    # if s3_client.upload_file("./tmp/tempfile.json", "ttrpg-bucket", "4456"):
    #     print("Sucessfully Uploaded file")
    # else:
    #     print("Error uploading file")

    

if __name__ == "__main__":
    main()