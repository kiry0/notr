/* DEPENDENCIES: */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
/* */

class Server {
    constructor() {
        this.app = express();
    };

    start() {
        /* Registers middlewares. */
        require('../../config/middlewares.js')(this.app);
        
        /* Registers routes. */
        require('../../config/routes.js')(this.app);

        const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@dev.yt6e2.mongodb.net/Notr`;

        mongoose.connect(mongodbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }, (err) => {
            console.log('Attempting to connect to MongoDB.....');

            if(err) {
                throw new Error(`An error has occured, unable to connect to MongoDB! => ${err}`);
            };

            console.log('Successfully connected to MongoDB!');

            try {
                console.log('Attempting to start the server.....');
                
                this.app.listen(process.env.EXPRESS_SERVER_PORT);
        
                console.log('Successfully started the server!');
            } catch (err) {
                throw new Error(`An error has occured, unable to start the server! => ${err}`);        
            // eslint-disable-next-line no-extra-semi
            };
        }); 
    };  
};

module.exports = Server;