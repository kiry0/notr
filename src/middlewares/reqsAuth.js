/* DEPENDENCIES: */
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
/* */

module.exports = async (req, res, next) => {
    const token = req.headers.authorization || req.session.token;

    if(!token) return res.sendStatus(400);

    const doesTokenExist = await User.findOne({ token }) ? true : false;

    if(!doesTokenExist) return res.sendStatus(404);
    
    next();
};