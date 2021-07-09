/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
    /* MIDDLEWARES: */
    // const reqsAuth = require('../middlewares/reqsAuth.js');
    /* */
    /* MODELS: */
    // const Notr = require('../models/Notr.js');
    const User = require('../models/User.js');
    /* */
/* */

router.get('/api/v1/user/:_id/notrs', async (req, res) => {
    const { _id } = req.params;

    if(!_id) return res.sendStatus('400');

    const user = await User.findById({ _id });

    if(!user) return res.sendStatus(404);

    const notrs = user.notrs;

    if(notrs.length <= 0) return res.sendStatus(204);

    res.status(200).send(notrs);
});

// router.post('/api/v1/notr', reqsAuth, (req, res) => {
//     const { title, content } = req.body;

//     Notr.create({
//        title,
//        content 
//     }, (err, doc) => {
//         // if(err) res.sendStatus(400);

//         // if((!title && !content)) res.sendStatus(204);

//         // console.log(doc);
//         console.log(req.session.cookie)
//         res.sendStatus(201);
//     });
// });

module.exports = router;