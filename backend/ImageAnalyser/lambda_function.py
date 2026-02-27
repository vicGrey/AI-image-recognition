import json
import boto3
import base64
import uuid
import datetime
import os
from decimal import Decimal

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])
bucket_name = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    try:
        # Parse incoming request
        body = json.loads(event['body'])
        image_base64 = body['image']
        filename = body.get('filename', 'upload.jpg')
        analysis_type = body.get('analysisType', 'labels')  # default to labels

        # Decode base64 image
        image_bytes = base64.b64decode(image_base64)

        # Generate unique ID
        image_id = str(uuid.uuid4())
        s3_key = f"uploads/{image_id}_{filename}"

        # Upload to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=image_bytes,
            ContentType='image/jpeg'
        )

        results = {}  # for JSON response (float values)
        db_results = {}  # for DynamoDB (Decimal values)

        if analysis_type == 'celebrities':
            # Call Rekognition Celebrity Recognition
            response = rekognition.recognize_celebrities(
                Image={
                    'S3Object': {
                        'Bucket': bucket_name,
                        'Name': s3_key
                    }
                }
            )

            # Process celebrities (for response and for DB)
            celebrities_response = []
            celebrities_for_db = []
            for celebrity in response['CelebrityFaces']:
                confidence = round(celebrity['MatchConfidence'], 2)
                # For response (float)
                celeb_resp = {
                    'Name': celebrity['Name'],
                    'Id': celebrity['Id'],
                    'MatchConfidence': confidence,
                    'Urls': celebrity.get('Urls', [])
                }
                celebrities_response.append(celeb_resp)
                # For DB (Decimal)
                celeb_db = {
                    'Name': celebrity['Name'],
                    'Id': celebrity['Id'],
                    'MatchConfidence': Decimal(str(confidence)),
                    'Urls': celebrity.get('Urls', [])
                }
                celebrities_for_db.append(celeb_db)

            results['celebrities'] = celebrities_response
            results['unrecognizedFaces'] = len(response.get('UnrecognizedFaces', []))
            
            # For DB, we need to store the Decimal version
            db_results['celebrities'] = celebrities_for_db
            db_results['unrecognizedFaces'] = results['unrecognizedFaces']  # int is fine

        else:  # default: labels
            response = rekognition.detect_labels(
                Image={
                    'S3Object': {
                        'Bucket': bucket_name,
                        'Name': s3_key
                    }
                },
                MaxLabels=10,
                MinConfidence=70
            )

            # Extract labels
            labels_response = []
            labels_for_db = []
            for label in response['Labels']:
                name = label['Name']
                confidence = round(label['Confidence'], 2)
                labels_response.append({'Name': name, 'Confidence': confidence})
                labels_for_db.append({'Name': name, 'Confidence': Decimal(str(confidence))})

            results['labels'] = labels_response
            db_results['labels'] = labels_for_db

        # Store in DynamoDB
        timestamp = datetime.datetime.utcnow().isoformat()
        item = {
            'ImageId': image_id,
            'filename': filename,
            'analysisType': analysis_type,
            'timestamp': timestamp,
            's3Url': f"s3://{bucket_name}/{s3_key}",
            **db_results  # merge the DB‑ready results (already with Decimals)
        }
        table.put_item(Item=item)

        # Return response (with float values, already in results)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'imageId': image_id,
                'analysisType': analysis_type,
                **results,
                'message': 'Analysis complete'
            })
        }

    except Exception as e:
        print(e)  # Log to CloudWatch
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
