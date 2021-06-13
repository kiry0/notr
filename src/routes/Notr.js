/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
    /* MODELS: */
    const Notr = require('../models/Notr.js');
    /* */
/* */

router.post('/api/v1/notr', (req, res) => {
    const { title, content } = req.body;

    Notr.create({
       title,
       content 
    }, (err, doc) => {
        // if(err) res.sendStatus(400);

        // if((!title && !content)) res.sendStatus(204);

        // console.log(doc);

        res.sendStatus(201);
    });
});

module.exports = router;