/* DEPENDENCIES: */
const redisClient = require('../lib/variables/redisClient.js');
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
    /* UTILS: */
    const msToSecs = require('../utils/msToSecs.js');
    /* */
/* */

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) return res.sendStatus(400);

    const doesTokenExist = await User.findOne({ token }) ? true : false;

    if(!doesTokenExist) return res.sendStatus(401);
    
    redisClient.get(token, (err, u) => {
        if(err) return console.error(err);

        if(!u) {
            const timestamp = Date.now();
            const tokenCount = 2;
            const user = {
                timestamp,
                tokenCount
            };

            redisClient.set(token, JSON.stringify(user));

            u = JSON.stringify(user);
        };

        user = JSON.parse(u);
        
        // console.log(`TS:${msToSecs(Date.now() - user.timestamp)} | TC:${user.tokenCount}`);
        
        // // Check's if the time difference has been >= 1hr.
        if(msToSecs(Date.now() - user.timestamp) >= 1) user.tokenCount = 2;

        // Check's if the user has enough tokens.
        if(user.tokenCount <= 0) return res.sendStatus(429);

        user.tokenCount--;
        user.timestamp = Date.now();

        redisClient.set(token, JSON.stringify(user));

        redisClient.expire(token, 60 * 60);

        // redis_client.get(token, (err, d) => {
        //     console.log(JSON.parse(d).tokenCount);
        // });

        next();
    });
};