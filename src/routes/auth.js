/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const RedisStore = require('express-brute-redis');
    /* MODELS: */
    // eslint-disable-next-line indent
    const User = require('../models/User.js');
    /* */
    /* MIDDLEWARES */
    const ExpressBrute = require('express-brute');
    /* */
    /* GLOBAL VARIABLES */
    const store = new RedisStore({
        host: process.env.REDIS_STORE_HOST,
        post: process.env.REDIS_STORE_PORT
    });
    const bruteforce = new ExpressBrute(store, {
        freeRetries: 10,
        minWait: 1*60*1000,
        maxWait: 60*60*1000,
    });
    /* */
/* */

router.post('/api/v1/auth/register', async (req, res) => {
    bruteforce.prevent;

    const { email, username, password } = req.body;
    
    if(!email || !username || !password) return res.sendStatus(400);

    const hashedPassword = await bcrypt.hash(password, 16);
    
    const user = await User.findOne({ username });

    if(!user) {
        const password = hashedPassword;
        const token = crypto.randomBytes(128).toString('hex');

        const user = new User({
            email,
            username,
            password,
            token
        });

        user.save();
        
        /* TODO: */
        // Redirect to the `log-in` route before assigning isLoggedIn to true.
        req.session.isLoggedIn = true;
        req.session.token = token;

        return res.cookie('token', token, {
            httpOnly: true,
            secure: true
        }).sendStatus(201);
    };

    res.sendStatus(409);
});

router.post('/api/v1/auth/log-in', async (req, res) => {
    bruteforce.prevent;

    const { email, username, password } = req.body;

    if(!email && !username) return res.sendStatus(400);

    if(!password) return res.sendStatus(400);
    
    const user = await User.find({ $or:[{ email }, { username }]});
        
    if(user.length <= 0) return res.sendStatus(404);
    
    if(!await bcrypt.compare(password, user[0].password)) return res.sendStatus(401);

    const { token } = user[0];

    req.session.isLoggedIn = true;
    req.session.token = token;

    return res.cookie('token', token, {
        httpOnly: true,
        secure: true
    }).sendStatus(200);
});

router.delete('/api/v1/auth/log-out', (req, res) => {
    bruteforce.prevent;

    if(!req.session.isLoggedIn && !req.cookies.token) return res.sendStatus(404);

    if(req.session.isLoggedIn) req.session.destroy();

    if(req.cookies.token) return res.clearCookie('token'); 

    res.sendStatus(200);
});

module.exports = router;