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

    try {
        const hashedPassword = await bcrypt.hash(password, 16);
    
        const user = await User.findOne({ username });

        if(!user) {
            const user = new User({
                email,
                username,
                password: hashedPassword,
                id: uuidv4(),
                token: crypto.randomBytes(128).toString('hex')
            });
    
            user.save();

            return res.sendStatus(201);
        };
    } catch (e) {
        console.error(e);

        res.sendStatus(500);
    };
});

module.exports = router;