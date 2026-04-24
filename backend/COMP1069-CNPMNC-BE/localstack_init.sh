#!/bin/bash
# filepath: /home/quocthoaii/music-web/backend/COMP1069-CNPMNC-BE/localstack_init.sh

set -e

echo "=== Initializing LocalStack S3 ==="

# Chạy lệnh bên trong container
docker-compose exec -T localstack bash << 'EOF'

# Đợi LocalStack khởi động
sleep 5

echo "Creating music-uploads bucket..."
awslocal s3 mb s3://music-uploads --region ap-southeast-1 2>/dev/null || echo "Bucket music-uploads already exists"

echo "Creating music-avatars bucket..."
awslocal s3 mb s3://music-avatars --region ap-southeast-1 2>/dev/null || echo "Bucket music-avatars already exists"

echo ""
echo "=== Available S3 Buckets ==="
awslocal s3 ls

echo ""
echo "=== LocalStack S3 initialization completed! ==="

EOF