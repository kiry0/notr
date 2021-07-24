/* eslint-disable indent */
/* DEPENDENCIES */
require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      MongoStore = require('connect-mongo');
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
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
       }));
};