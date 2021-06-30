/* DEPENDENCIES: */
const redis = require('redis');
require('dotenv').config();
/* */

const redisClient = redis.createClient(process.env.REDIS_PORT);

module.exports = redisClient;