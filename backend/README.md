# AI Image Recognizer Backend (Lambda)

This folder contains the Python code for the AWS Lambda function that handles image analysis.

## What It Does

- Receives an image (`base64`) and analysis type (`labels` or `celebrities`) from API Gateway.
- Stores the image in Amazon S3, calls Amazon Rekognition, and saves results to Amazon DynamoDB.

## Environment Variables

- `TABLE_NAME`: DynamoDB table name (for example, `ImageLabels`)
- `BUCKET_NAME`: S3 bucket for storing uploaded images

## Required IAM Permissions

- Rekognition: `DetectLabels`, `RecognizeCelebrities`
- DynamoDB: `PutItem`
- S3: `PutObject`
- CloudWatch Logs: basic execution role

## API Payload (From Frontend)

```json
{
  "image": "base64...",
  "filename": "photo.jpg",
  "analysisType": "labels" | "celebrities"
}
```

## Response Example (Labels)

```json
{
  "imageId": "uuid",
  "labels": [{"Name": "Dog", "Confidence": 99.2}],
  "message": "Analysis complete"
}
```

## Deployment

Zip `lambda_function.py` and upload it to AWS Lambda via the console or AWS CLI. Then set environment variables and attach the IAM role.

See the main project README for full setup instructions.
