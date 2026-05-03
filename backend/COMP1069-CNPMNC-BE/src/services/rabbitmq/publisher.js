const amqp = require('amqplib');
const RABBITMQ_CONFIG = require('../../config/rabbitmq');
const logger = require('../../utils/logger');

class RabbitMQPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  // connect & exchange
  async connect() {
    try {
      this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
      this.channel = await this.connection.createChannel();

      //   create exchange
      await this.channel.assertExchange(
        RABBITMQ_CONFIG.exchange.name,
        RABBITMQ_CONFIG.exchange.type,
        {
          durable: RABBITMQ_CONFIG.exchange.durable,
        },
      );

      logger.info(
        'RabbitMQ Publisher connected and exchange created successfully',
      );

      //   handle connection error
      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error:', err);
        setTimeout(() => this.connect(), RABBITMQ_CONFIG.reconnectTimeout);
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed. Reconnecting...');
        setTimeout(() => this.connect(), RABBITMQ_CONFIG.reconnectTimeout);
      });
    } catch (error) {
      logger.error('Failed to connect RabbitMQ:', error);
      setTimeout(() => this.connect(), RABBITMQ_CONFIG.reconnectTimeout);
    }
  }
  // publish message to exchange with routing key
  // @param {string} routingKey - routing key to determine which queue to send
  // @param {object} message - message payload (will be stringified to JSON)
  // @param {object} option - additional publish options (e.g. headers, expiration)
  async publish(routingKey, message, option = {}) {
    try {
      if (!this.channel) {
        throw new Error('Channel not connected');
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      const publishOptions = {
        persistent: true, // ensure message is saved to disk
        contentType: 'application/json',
        ...option, // allow overriding options like headers, expiration
      };

      // publish message
      const published = this.channel.publish(
        RABBITMQ_CONFIG.exchange.name,
        routingKey,
        messageBuffer,
        publishOptions,
      );

      if (!published) {
        logger.warn('Message rejected by broker, will retry');
        return false;
      }
      logger.info('Message published: {routingKey}', { messageId: message.id });
      return true;
    } catch (error) {
      logger.error('Publish error:', error);
      throw error;
    }
  }

  // publish audio convert queue
  async publishAudioConvert(messageData) {
    const message = {
      id: `audio-${Date.now()}`,
      type: 'AUDIO-CONVERT',
      timestamp: new Date().toISOString(),
      ...messageData,
    };
    return this.publish(
      RabbitMQPublisher.queues.audioConvert.routingKey,
      message,
    );
  }

  // publish metadata extract queue
  async publishMetadataExtract(messageData) {
    const message = {
      id: `metadata-${Date.now()}`,
      type: 'METADATA-EXTRACT',
      timestamp: new Date().toISOString(),
      ...messageData,
    };
    return this.publish(
      RABBITMQ_CONFIG.queues.metadataExtract.routingKey,
      message,
    );
  }

  // publish thumbnail generate queue
  async publishThumbnailGenerate(messageData) {
    const message = {
      id: `thumbnail-${Date.now()}`,
      type: 'THUMBNAIL-GENERATE',
      timestamp: new Date().toISOString(),
      ...messageData,
    };
    return this.publish(
      RABBITMQ_CONFIG.queues.thumbnailGenerate.routingKey,
      message,
    );
  }

  // close connection
  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      logger.info('RabbitMQ Publisher closed');
    } catch (error) {
      logger.error('Error closing RabbitMQ:', error);
    }
  }
}

module.exports = new RabbitMQPublisher();
