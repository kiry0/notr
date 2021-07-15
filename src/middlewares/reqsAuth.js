/* DEPENDENCIES: */
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
/* */
module.exports = ({
    requiredPermissionLevel = 1
} = {}) => {
    return async (req, res, next) => {
        const token = req.headers.authorization || req.session.token;

        if(!token) return res.sendStatus(400);
    
        const user = await User.findOne({ token }),
              doesTokenExist = user.token ? true : false;
    
        if(!doesTokenExist) return res.sendStatus(404);
        
        if(user.permissionLevel < requiredPermissionLevel) return res.sendStatus(401);

        next();
    };
};