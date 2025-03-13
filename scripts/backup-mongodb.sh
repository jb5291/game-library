#!/bin/bash

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/mongodb"
CONTAINER_NAME="mongodb-prod"
S3_BUCKET="your-backup-bucket"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup MongoDB
echo "Starting MongoDB backup..."
docker exec $CONTAINER_NAME mongodump --out=/data/db/backup

# Create archive
echo "Creating backup archive..."
docker exec $CONTAINER_NAME tar -czf /data/db/backup_$TIMESTAMP.tar.gz -C /data/db backup
docker cp $CONTAINER_NAME:/data/db/backup_$TIMESTAMP.tar.gz $BACKUP_DIR/

# Clean up container
docker exec $CONTAINER_NAME rm -rf /data/db/backup /data/db/backup_$TIMESTAMP.tar.gz

# Upload to S3 (if AWS CLI is installed)
if command -v aws &> /dev/null; then
    echo "Uploading backup to S3..."
    aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.tar.gz s3://$S3_BUCKET/mongodb/
fi

# Keep only the last 7 local backups
echo "Cleaning up old backups..."
ls -tp $BACKUP_DIR/*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"