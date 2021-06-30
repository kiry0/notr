/* DEPENDENCIES: */
const redis_client = require('../lib/variables/redis-client.js');
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
    
    redis_client.get(token, (err, u) => {
        if(err) return console.error(err);

        if(!u) {
            const timestamp = Date.now();
            const tokenCount = 3600;
            const user = {
                token,
                timestamp,
                tokenCount
            };

            redis_client.set(token, JSON.stringify(user));

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

        redis_client.set(token, JSON.stringify(user));

        redis_client.expire(token, 60 * 60);

        // redis_client.get(token, (err, d) => {
        //     console.log(JSON.parse(d).tokenCount);
        // });

        next();
    });
};