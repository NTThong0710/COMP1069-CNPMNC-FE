#!/bin/bash
# filepath: /home/quocthoaii/music-web/backend/COMP1069-CNPMNC-BE/localstack-init.d/01_create_buckets.sh

echo "Creating S3 buckets..."

awslocal s3 mb s3://music-uploads --region ap-southeast-1 2>/dev/null || true
awslocal s3 mb s3://music-avatars --region ap-southeast-1 2>/dev/null || true

echo "S3 buckets created successfully!"
awslocal s3 ls