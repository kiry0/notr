/* DEPENDENCIES */
const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcrypt'),
      crypto = require('crypto'),
      RedisStore = require('express-brute-redis');
    /* MODELS */
    const User = require('../models/User.js');
    /* */
    /* SCHEMAS */
    const { registrationSchema, logInSchema } = require('../schemas/auth.js');
    /* */
    /* MIDDLEWARES */
    const ExpressBrute = require('express-brute');
    /* */
    /* GLOBAL VARIABLES */
    const store = new RedisStore({
        host: process.env.REDIS_STORE_HOST,
        post: process.env.REDIS_STORE_PORT
    }),
    bruteforce = new ExpressBrute(store, {
        freeRetries: 100,
        attachResetToRequest: false,
        refreshTimeoutOnRequest: false,
        minWait: 1000*60*60*24,
        maxWait: 1000*60*60*24,
        lifetime: 1000*60*60*24,
    });
    /* */
/* */

router.post('/api/v1/auth/register', async (req, res) => {
    bruteforce.prevent;

    try {
        await registrationSchema.validateAsync(req.body);

        const { email, username, password } = req.body,
        hashedPassword = await bcrypt.hash(password, 16),
        doesUserExist = (await User.findOne({ $or:[{ email }, { username }]}))[0];

        if(doesUserExist) return res.sendStatus(409);

        const token = crypto.randomBytes(128).toString('hex'),
              permissionLevel = 1;
        
        new User({
            email,
            username,
            password: hashedPassword,
            token,
            permissionLevel
        }).save();

        req.session.isLoggedIn = true;
        req.session.token = token;

        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        });
        
        res.redirect('/', 201);
    } catch(error) {
        if(error.isJoi === true) res.sendStatus(422);

        res.sendStatus(500);
    };
});

router.post('/api/v1/auth/log-in', async (req, res) => {
    bruteforce.prevent;

    try {
        await logInSchema.validateAsync(req.body);

        const { email, username, password } = req.body;

        const user = (await User.find({ $or:[{ email }, { username }]}))[0];

        if(!user) return res.sendStatus(404);

        const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
        
        if(!doesPasswordMatch) return res.sendStatus(401);    

        const { token } = user;

        req.session.isLoggedIn = true;
        req.session.token = token;

        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        });

        res.redirect('/', 201);
    } catch(error) {
        if(error.isJoi === true) res.sendStatus(422);

        res.sendStatus(500);
    }; 
});

router.delete('/api/v1/auth/log-out', async (req, res) => {
    if(!req.session.isLoggedIn && !req.cookies.token) return res.sendStatus(404);

    if(req.session) req.session.destroy();

    if(req.session.isLoggedIn) req.session.isLoggedIn = false;

    try {
        const isTokenValid = await User.findOne(token);

        if(isTokenValid) res.clearCookie('token');

        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    };
});

module.exports = router;