const amqp = require('amqplib');
const RABBITMQ_CONFIG = require('../../config/rabbitmq');
const logger = require('../../utils/logger');

class RabbitMQConsumer {
  constructor(queueConfig) {
    this.queueConfig = queueConfig;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
      this.channel = await this.connection.createChannel();

      const queue = 'hello';
      await this.channel.assertQueue(queue, {
        durable: true,
        // arguments: { 'x-queue-type': 'quorum' },
      });
      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        queue,
      );
      this.channel.consume(
        queue,
        (msg) => {
          console.log(' [x] Received %s', msg.content.toString());
        },
        {
          noAck: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RabbitMQConsumer();
