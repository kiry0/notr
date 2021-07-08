/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
    /* MIDDLEWARE'S: */
    const reqsAuth = require('../../middlewares/reqsAuth.js');
    /* */
    /* MODELS: */
    const Notr = require('../../models/Notr.js');
    /* */
/* */

router.post('/api/v1/notr', reqsAuth, (req, res) => {
    const { title, content } = req.body;

    Notr.create({
       title,
       content 
    }, (err, doc) => {
        // if(err) res.sendStatus(400);

        // if((!title && !content)) res.sendStatus(204);

        // console.log(doc);
        console.log(req.session.cookie)
        res.sendStatus(201);
    });
});

module.exports = router;