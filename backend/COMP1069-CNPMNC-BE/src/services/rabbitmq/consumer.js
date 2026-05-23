// const amqp = require('amqplib');
// const RABBITMQ_CONFIG = require('../../config/rabbitmq');
// const logger = require('../../utils/logger');

// class RabbitMQConsumer {
//   constructor(queueConfig) {
//     this.queueConfig = queueConfig;
//     this.connection = null;
//     this.channel = null;
//   }

//   // init connection & queue binding
//   async connect() {
//     try {
//       this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
//       this.channel = await this.connection.createChannel();

//       // set prefetch count (max messages processing in same time)
//       this.channel.prefetch(this.queueConfig.prefetch);

//       // assert the exchange
//       await this.channel.assertExchange(
//         RABBITMQ_CONFIG.exchange.name,
//         RABBITMQ_CONFIG.exchange.type,
//         {
//           durable: RABBITMQ_CONFIG.exchange.durable,
//         },
//       );

//       // assert the queue
//       this.channel.assertQueue(this.queueConfig.name, {
//         durable: this.queueConfig.durable,
//       });

//       // bind the queue to the exchange with routing key
//       this.channel.bindQueue(
//         this.queueConfig.name,
//         RABBITMQ_CONFIG.exchange.name,
//         this.queueConfig.routingKey,
//       );

//       logger.info(
//         `Consumer connected: Queue="${this.queueConfig.name}", RoutingKey="${this.queueConfig.routingKey}"`,
//       );

//       // handle reconnection
//       this.connection.on('error', (err) => {
//         logger.error('RabbitMQ connection error:', err);
//         setTimeout(() => this.connect(), RABBITMQ_CONFIG.reconnectTimeout);
//       });

//       this.connection.on('close', () => {
//         logger.warn('RabbitMQ connection closed. Reconnecting...');
//         setTimeout(() => this.connect(), RABBITMQ_CONFIG.reconnectTimeout);
//       });
//     } catch (error) {
//       logger.error('Failed to connect consumer:', error);
//       setTimeout(() => {
//         this.connect();
//       }, RABBITMQ_CONFIG.reconnectTimeout);
//     }
//   }

//   async startConsuming(messageHandler) {
//     try {
//       if (!this.channel) {
//         throw new Error('Channel not connected');
//       }
//       logger.info(`Start consuming from queue: ${this.queueConfig.name}`);

//       this.channel.consume(this.queueConfig.name, async (msg) => {
//         if (msg) {
//           const startTime = Date.now();
//           try {
//             // convert buffer to obj
//             const content = JSON.parse(msg.content.toString());
//             logger.info(`Message received from ${this.queueConfig.name}:`, {
//               messageId: content.id,
//             });
//             // call handler function
//             await messageHandler(content);

//             // acknowledge message (remove from queue)
//             this.channel.ack(msg);

//             const duration = Date.now() - startTime;
//             logger.info(`Message processed successfully (${duration}ms)`, {
//               messageId: content.id,
//             });
//           } catch (error) {
//             const duration = Date.now() - startTime;
//             logger.error(`Error processing message (${duration}ms):`, error);

//             // requeue message for retry
//             this.channel.nack(msg, false, true);
//           }
//         }
//       });
//     } catch (error) {
//       logger.error('Error starting consumer:', error);
//       setTimeout(() => {
//         this.startConsuming(messageHandler);
//       }, RABBITMQ_CONFIG.reconnectTimeout);
//     }
//   }

//   // close connection
//   async close() {
//     try {
//       if (this.channel) {
//         await this.channel.close();
//       }
//       if (this.connection) {
//         await this.connection.close();
//       }
//       logger.info('Consumer closed:', this.queueConfig.name);
//     } catch (error) {
//       logger.error('Error closing RabbitMQ:', error);
//     }
//   }
// }

// module.exports = new RabbitMQConsumer();
