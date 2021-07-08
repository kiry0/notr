/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
    /* MODELS: */
    const User = require('../../models/User.js');
    /* */
/* */

router.post('/api/v1/auth/register', async (req, res) => {
    const { email, username, password } = req.body;
    
    if(!email || !username || !password) return res.sendStatus(400);

    const hashedPassword = await bcrypt.hash(password, 16);
    
    const user = await User.findOne({ username });

    if(!user) {
        const password = hashedPassword;
        const id = uuidv4();
        const token = crypto.randomBytes(128).toString('hex');

        const user = new User({
            email,
            username,
            password,
            id,
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

module.exports = router;