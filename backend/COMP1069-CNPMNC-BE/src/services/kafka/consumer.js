const kafka = require('../../config/kafka');

const consumer = kafka.consumer({ groupId: 'test-group' });

const connectConsumer = async () => {
  await consumer.connect();
  console.log('Kafka connected consumer');
};

const consumerMessage = async (topic, callback) => {
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      callback(data);
    },
  });
};

module.exports = {
  connectConsumer,
  consumerMessage,
};
