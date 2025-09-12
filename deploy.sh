#!/usr/bin/env bash

npm install
npm i -g @quasar/cli
npm run build

# Default index TTL of 8 hours
INDEX_MAX_AGE=28800

# In development, check for a new file every 15 minutes
if [[ $STAGE == "dev" ]]; then
  INDEX_MAX_AGE=1500
fi
echo "======="
ls
echo $S3_BUCKET
cd dist/spa
aws s3 cp --recursive . s3://$S3_BUCKET
echo "======="


aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'
