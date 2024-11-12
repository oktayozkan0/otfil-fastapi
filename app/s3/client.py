import boto3

from core.config import get_app_settings

settings = get_app_settings()

s3_client = boto3.client(
    service_name='s3',
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key,
    aws_secret_access_key=settings.aws_secret_key
)

def upload_to_s3(file, key):
    s3_client.put_object(Bucket=settings.aws_s3_bucket_name, Key=key, Body=file)
    return

def get_from_s3(key):
    response = s3_client.get_object(Bucket=settings.aws_s3_bucket_name, Key=key)
    return response

def delete_from_s3(key):
    response = s3_client.delete_object(Bucket=settings.aws_s3_bucket_name, Key=key)
    return response
