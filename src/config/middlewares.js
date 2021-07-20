/* eslint-disable indent */
/* DEPENDENCIES */
require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      RedisStore = require('connect-redis')(session),
      redisClient = require('../lib/variables/redisClient.js');
    /* MIDDLEWARES */
    const helmet = require('helmet'),
          json = require('express').json,
          cors = require('cors');
    /* */
/* */

module.exports = (app) => {
    app
       .use(helmet())
       .use(json({
           limit: '100kb',
           strict: true,
           type: 'application/json'
       }))
       .use(express.urlencoded({ 
           extended: false 
        }))
       .use(cors({
           origin: 'http://localhost:8000/',
           credentials: true
       }))
       .use(session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
       }));
};