/* DEPENDENCIES: */
const redisClient = require('../lib/variables/redisClient.js');
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
    /* UTILS: */
    const msToSecs = require('../utils/msToSecs.js');
    /* */
/* */

module.exports = ({
    tokens,
    interval,
    seconds = 60 * 60,
    message = 'Too many requests, please try again later.',
    statusCode = 429,
    setHeader = true,
    permissionLevelRequiredToBypass = 5,
} = {}) => {
    if(!tokens || tokens.toString().trim().length === 0) throw new TypeError('tokens cannot be null, undefined or empty!');

    if(!interval || interval.toString().trim().length === 0) throw new TypeError('interval cannot be null, undefined or empty!');
    
    return async(req, res, next) => {
        const token = req.headers.authorization || req.session.token;
        let userPermissionLevel = (await User.findOne({ token })).permissionLevel;

        if(userPermissionLevel >= permissionLevelRequiredToBypass) return next();
        
        redisClient.get(token, (err, user) => {
            if(err) return res.status(500).send(err);
    
            if(!user) {
                const timestamp = Date.now(),
                      IP = req.ip;
                user = {
                    timestamp,
                    tokens,
                    IP
                };

                redisClient.setex(token, seconds, JSON.stringify(user));
            };

            user = JSON.parse(user);

            // // Checks if the time difference has been >= interval.
            if(msToSecs(Date.now() - user.timestamp) >= interval) user.tokens = tokens;
            
            // Checks if the user have enough tokens.
            if(user.tokens <= 0) {
                if(setHeader) res.set('retry-after', `${interval - msToSecs(Date.now() - user.timestamp)} seconds.`);

                return res.status(statusCode).send(message);
            };
        
            user.tokens--;
            
            user.timestamp = Date.now();

            redisClient.setex(token, seconds, JSON.stringify(user));
    
            next();
        });
    };
};