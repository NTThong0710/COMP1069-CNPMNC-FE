const { s3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: true,
});

module.exports = {
  s3Client,
};
