/* eslint-disable indent */
/* DEPENDENCIES: */
require('dotenv').config();
    /* MIDDLEWARES */
    const json = require('express').json,
          cors = require('cors'),
          cookieParser = require('cookie-parser'),
          session = require('express-session');
    /* */
/* */

module.exports = (app) => {
    app.use(json())
       .use(cors())
       .use(cookieParser())
       .use(session({
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            cookie: { secure: true }
       }));
};