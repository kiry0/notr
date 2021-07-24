/* DEPENDENCIES */
const Server = require('./lib/classes/Server.js');
/* */

const server = new Server({
    mongodbURI: process.env.MONGODB_URI
});

server.start();