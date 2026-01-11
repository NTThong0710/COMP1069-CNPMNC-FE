const { pubClient } = require('../config/redis');

const clearCacheByPattern = async (pattern) => {
  try {
    const keys = await pubClient.keys(pattern);
    if (keys.length > 0) {
      await pubClient.del(keys);
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Error clearing cache by pattern:', error);
  }
};

module.exports = {
  clearCacheByPattern,
};
