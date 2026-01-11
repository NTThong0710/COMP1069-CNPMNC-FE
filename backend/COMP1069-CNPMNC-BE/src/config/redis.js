const { createClient } = require('redis');

const pubClient = createClient({
  url: process.env.REDIS_URL,
});

const subClient = pubClient.duplicate();

async function connectRedis() {
  await Promise.all([await pubClient.connect(), await subClient.connect()]);
  console.log('Connected to Redis');
}
module.exports = { pubClient, subClient, connectRedis };
