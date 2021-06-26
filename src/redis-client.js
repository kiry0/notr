/* DEPENDENCIES: */
const redis = require('redis');
require('dotenv').config();
/* */

const client = redis.createClient(process.env.REDIS_PORT);

module.exports = client;