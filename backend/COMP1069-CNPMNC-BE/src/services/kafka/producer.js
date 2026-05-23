const kafka = require('../../config/kafka');

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
};

module.exports = {
  connectProducer,
  sendMessage,
};
