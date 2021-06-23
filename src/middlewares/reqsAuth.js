/* DEPENDENCIES: */
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
/* */

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) return res.sendStatus(400);

    const isTokenValid = await User.findOne({ token }) ? true : false;

    if(!isTokenValid) return res.sendStatus(401);

    next();
};