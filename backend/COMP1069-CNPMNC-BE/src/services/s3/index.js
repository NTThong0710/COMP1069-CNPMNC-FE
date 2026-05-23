// const {
//   GetObjectCommand,
//   PutObjectCommand,
//   DeleteObjectCommand,
//   ListObjectsV2Command,
// } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const fs = require('fs').promises;
// const path = require('path');
// const s3Client = require('../config/s3');
// const logger = require('../utils/logger');
// const { parseArgs } = require('util');

// class S3Service {
//   constructor() {
//     this.bucket = process.env.S3_BUCKET;
//   }

//   // upload file to s3 from buffer/stream to s3
//   async uploadMusicDirect(fileContent, fileName, contentType, metadata = {}) {
//     try {
//       const key = `music/${fileName}`;
//       // put obj request
//       const params = {
//         Bucket: this.bucket,
//         Key: key,
//         Body: fileContent,
//         ContentType: contentType,
//         Metadata: metadata,
//       };
//       await s3Client.send(new PutObjectCommand(params));
//       logger.info(`File uploaded directly to S3: ${key}`);
//       return {
//         bucket: this.bucket,
//         key,
//         uploadedAt: new Date().toISOString(),
//       };
//     } catch (error) {
//       logger.error('S3 Direct upload error:', error);
//       throw error;
//     }
//   }
//   //   douwnload file from s3 anh return stream
//   async douwnloadMusic(fileName, localPath) {
//     try {
//       const key = `music/${fileName}`;
//       const params = {
//         Bucket: this.bucket,
//         Key: key,
//       };
//       const response = await s3Client.send(new GetObjectCommand(params));
//       // handle stream
//       const writeStream = require('fs').createWriteStream(localPath);
//       response.Body.pipe(writeStream);

//       return new Promise((resolve, reject) => {
//         writeStream.on('finish', () => {
//           logger.info(`File downloaded from s3: ${localPath}`);
//           resolve(localPath);
//         });
//         writeStream.on('error', reject);
//       });
//     } catch (error) {
//       logger.error('S3 download error:', error);
//       throw error;
//     }
//   }
//   //   delete file from s3
//   async deleteMusic(fileName) {
//     try {
//       const key = `music/${fileName}`;
//       const params = {
//         bucket: this.bucket,
//         key: key,
//       };
//       await s3Client.send(new DeleteObjectCommand(params));
//       logger.info(`File deleted from s3: ${key}`);
//       return {
//         deleted: true,
//         key,
//       };
//     } catch (error) {
//       logger.error('S3 delete error:', error);
//       throw error;
//     }
//   }

//   //   get presigned url for download
//   async getPresignedUrl(fileName, expiresIn = 3600) {
//     try {
//       const key = `music/${fileName}`;
//       const params = {
//         Bucket: this.bucket,
//         Key: key,
//       };
//       const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
//         expiresIn,
//       });
//       logger.info(`Presigned URL generated: ${fileName}`);
//       return url;
//     } catch (error) {
//       logger.error('Presigned URL error:', error);
//       throw error;
//     }
//   }

//   //   list all music
//   async listMusic(prefix = 'music/') {
//     try {
//       const params = {
//         Bucket: this.bucket,
//         Prefix: prefix,
//       };
//       const response = await s3Client.send(new ListObjectsV2Command(params));

//       const files =
//         response.Contents ||
//         [].map((item) => ({
//           key: item.key,
//           size: item.size,
//           lastModified: item.lastModified,
//         }));
//       logger.info(`Listed ${files.length} files from s3`);
//       return files;
//     } catch (error) {
//       logger.error('S3 list error:', error);
//       throw error;
//     }
//   }

//   //   get file from s3 (return stream)
//   async getFilestream(fileName) {
//     try {
//       const key = `music/${fileName}`;
//       const params = {
//         Bucket: this.bucket,
//         Key: key,
//       };
//       const response = await s3Client.send(new GetObjectCommand(params));
//       return response.Body;
//     } catch (error) {
//       logger.error('S3 get stream error', error);
//       throw error;
//     }
//   }
// }

// module.exports = new S3Service();
