/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
    /* MODELS: */
    const User = require('../../models/User.js');
    /* */
/* */

router.post('/api/v1/auth/log-in', async (req, res) => {
    const { email, username, password } = req.body;

    if(!email || !username || !password) return res.sendStatus(400);
    
    const user = await User.find({ $or:[{ email }, { username }]});
        
    if(!user) return res.sendStatus(404);

    if(!await bcrypt.compare(password, user[0].password)) return res.sendStatus(401);

    const { token } = user[0];

    req.session.isLoggedIn = true;
    req.session.token = token;

    return res.cookie('token', token, {
        httpOnly: true,
        secure: true
    }).sendStatus(200);
});

module.exports = router;