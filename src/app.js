/* DEPENDENCIES: */
const Server = require('./lib/classes/Server.js');
/* */

const server = new Server({
    mongodbURI: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@dev.yt6e2.mongodb.net/Notr`
});

server.start();