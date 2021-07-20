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
    const { 
        signUp,
        logIn
    } = require('../schemas/auth.js');
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

router.post('/api/v1/auth/sign-up', async (req, res) => {
    bruteforce.prevent;

    try {
        await signUp.validateAsync(req.body);

        const { 
            firstName,
            lastName,
            emailAddress,
            username,
            password
        } = req.body,
        hashedPassword = await bcrypt.hash(password, 16),
        doesUserExist = await User.findOne({ $or:[{ emailAddress }, { username }]});

        if(doesUserExist) return res.status(409).send('A user with that emailAddress/username is already registered!');

        const token = crypto.randomBytes(128).toString('hex'),
              permissionLevel = 1;
              user = new User({
                firstName,
                lastName,
                emailAddress,
                username,
                password: hashedPassword,
                token,
                permissionLevel
              });

        user.save();

        req.session.user = {
            firstName,
            lastName,
            emailAddress,
            username,
            password: hashedPassword,
            token,
            permissionLevel,
            isLoggedIn: true,
        };
        
        res.sendStatus(200);
        // res.redirect(302, '/');
    } catch(error) {
        if(error.isJoi === true) res.status(422).send('Invalid Form Body!');

        console.error(error);

        res.sendStatus(500);
    };
});

router.post('/api/v1/auth/log-in', async (req, res) => {
    bruteforce.prevent;

    try {
        await logIn.validateAsync(req.body);

        const { emailAddress, username, password } = req.body;

        const user = (await User.find({ $or:[{ emailAddress }, { username }]}))[0];

        if(!user) return res.sendStatus(404);

        const {
            firstName,
            lastName,
            token,
            permissionLevel,
        } = user;

        const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
        
        if(!doesPasswordMatch) return res.sendStatus(401);    

        req.session.user = {
            firstName,
            lastName,
            emailAddress: emailAddress || user.emailAddress,
            username: username || user.username,
            password,
            token,
            permissionLevel,
            isLoggedIn: true,
        };

        res.sendStatus(200);
        // res.redirect(301, '/');
    } catch(error) {
        if(error.isJoi === true) res.status(422).send('Invalid Form Body!');
        
        console.error(error);

        res.sendStatus(500);
    }; 
});

router.delete('/api/v1/auth/log-out', async (req, res) => {
    if(!req.session.user) return res.sendStatus(404);

    req.session.destroy();

    res.sendStatus(200);
});

module.exports = router;