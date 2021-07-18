/* DEPENDENCIES */
const redisClient = require('../lib/variables/redisClient.js');
    /* MODELS */
    const User = require('../models/User.js');
    /* */
    /* UTILS */
    const msToSecs = require('../utils/msToSecs.js');
    /* */
/* */

module.exports = ({
    tokens,
    duration,
    seconds = 60 * 60,
    errorMessage = 'Too many requests, please try again later.',
    statusCode = 429,
    setHeader = true,
    permissionLevelRequiredToBypass = 5,
} = {}) => {
    if(!tokens || tokens.toString().trim().length === 0) throw new TypeError('tokens cannot be null, undefined or empty!');

    if(!duration || duration.toString().trim().length === 0) throw new TypeError('duration cannot be null, undefined or empty!');
    
    return async(req, res, next) => {
        const token = req.headers.authorization || req.session.token;
        let userPermissionLevel = (await User.findOne({ token })).permissionLevel;

        if(userPermissionLevel >= permissionLevelRequiredToBypass) return next();
        
        redisClient.get(token, (err, user) => {
            if(err) return res.status(500).send(err);
    
            if(!user) {
                const ts = Date.now(),
                      IP = req.ip;
                user = {
                    ts,
                    tokens,
                    IP
                };

                redisClient.setex(token, seconds, JSON.stringify(user));
            };

            user = JSON.parse(user);

            if(msToSecs(Date.now() - user.ts) >= duration) user.tokens = tokens;
            
            if(user.tokens <= 0) {
                if(setHeader) res.set('retry-after', `${duration - msToSecs(Date.now() - user.ts)} seconds.`);

                return res.status(statusCode).send(errorMessage);
            };
            
            user.tokens--;
            
            user.ts = Date.now();

            redisClient.setex(token, seconds, JSON.stringify(user));
    
            next();
        });
    };
};