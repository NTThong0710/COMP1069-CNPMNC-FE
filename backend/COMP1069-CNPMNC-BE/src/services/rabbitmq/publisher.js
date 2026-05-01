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
  //   publish message to exchange with routing key
  async publish(routingKey, message, option = {}) {
    try {
      if (!this.channel) {
        throw new Error('Channel not connected');
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      const publishOptions = {
        persistent: true, // ensure message is saved to disk
        contentType: 'application/json',
        ...option,
      };

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
}

module.exports = new RabbitMQPublisher();
