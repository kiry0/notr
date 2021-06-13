/* DEPENDENCIES: */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const glob = require('glob');
    /* MIDDLEWARE: */
    const middlewares = [require('express').json(), require('cors')()];
    /* */
/* */

class Server {
    constructor() {
        this.app = express();
    };

    start() {
        const routes = glob.sync("**/*.js", { cwd: `${process.cwd()}/routes` }).map(r => `../../routes/${r}`);

        this.app.use(...middlewares);

        this.app.use(require(...routes));

        const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@dev.yt6e2.mongodb.net/Notr`;

        mongoose.connect(mongodbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            console.log('Attempting to connect to MongoDB.....');

            if(err) {
                throw new Error(`An error has occured, unable to connect to MongoDB! => ${err}`);
            };

            console.log('Successfully connected to MongoDB!');

            try {
                console.log('Attempting to start the server.....');
                
                this.app.listen(process.env.PORT);
        
                console.log('Successfully started the server!');
            } catch (err) {
                throw new Error(`An error has occured, unable to start the server! => ${err}`);        
            };
        }); 
    };  
};

module.exports = Server;