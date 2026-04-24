// const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_CONFIG = {
  // connect
  url: process.env.RABBITMQ_URL,

  // exchange config
  exchange: {
    name: process.env.RABBITMQ_EXCHANGE_NAME,
    type: 'direct',
    durable: true,
  },

  // queues config
  queues: {
    // queue 1: convert audio format
    audioConvert: {
      name: process.env.QUEUE_AUDIO,
      routingKey: 'audio.convert',
      durable: true,
      prefetch: 1,
    },

    // queue 2: extract metadata
    metadaExtract: {
      name: process.env.QUEUE_METADATA,
      routingKey: 'metadata.extract',
      durable: true,
      prefetch: 1,
    },

    // queue 3: generate thumbnail
    thumbnailGenerate: {
      name: process.env.QUEUE_THUMBNAIL,
      routingKey: 'thumbnail.generate',
      durable: true,
      prefetch: 1,
    },
  },
};

module.exports = {
  RABBITMQ_CONFIG,
};
