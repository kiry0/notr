/* DEPENDENCIES: */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
/* */

class Server {
    constructor({
        mongodbURI,
    }) {
        this.app = express();
        this.mongodbURI = mongodbURI;
    };

    start() {
        mongoose.connect(this.mongodbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }, (err) => {
            console.log('Attempting to connect to MongoDB.....');

            if(err) throw new Error(`An error has occured, unable to connect to MongoDB! => ${err}`);

            console.log('Successfully connected to MongoDB!');

            try {
                console.log('Attempting to start the server.....');
                
                /* Registers middlewares. */
                require('../../config/middlewares.js')(this.app);
        
                /* Registers routes. */
                require('../../config/routes.js')(this.app);

                this.app.listen(process.env.EXPRESS_SERVER_PORT);
        
                console.log('Successfully started the server!');
            } catch (err) {
                throw new Error(`An error has occured, unable to start the server! => ${err}`);        
            // eslint-disable-next-line no-extra-semi
            };
        }); 
    };  

    stop() {
        process.exit();
    };
};

module.exports = Server;