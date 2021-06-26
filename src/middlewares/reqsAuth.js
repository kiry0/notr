/* DEPENDENCIES: */
const redis_client = require('../redis-client.js');
    /* MODELS: */
    const User = require('../models/User.js');
    /* */
    /* UTILS: */
    const msToMins = require('../utils/msToMins.js');
    /* */
/* */

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) return res.sendStatus(400);

    const doesTokenExist = await User.findOne({ token }) ? true : false;

    if(!doesTokenExist) return res.sendStatus(401);

    const { email, username, id } = await User.findOne({ token });
    
    redis_client.get(id, (err, u) => {
        if(err) return console.error(err);

        if(!u) {
            const timestamp = Date.now();
            const tokenCount = 3600;
            const user = {
                id,
                email,
                username,
                token,
                timestamp,
                tokenCount
            };

            redis_client.set(id, JSON.stringify(user));

            u = JSON.stringify(user);
        };

        user = JSON.parse(u);

        // Check's if the user has enough tokens.
        if(user.tokenCount <= 0) return res.sendStatus(429);

        // // Check's if the time difference has been >= 1hr.
        if(msToMins(Date.now() - user.timestamp) >= 60) user.tokenCount = 3600;

        user.tokenCount--;
        
        redis_client.set(id, JSON.stringify(user));

        redis_client.expire(id, 60 * 60);

        // redis_client.get(id, (err, d) => {
        //     console.log(JSON.parse(d).tokenCount);
        // });

        next();
    });
};