/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
    /* MODELS: */
    const Notr = require('../models/Notr.js');
    /* */
/* */

router.post('/api/v1/notr', (req, res) => {
    console.log(req.body);
    res.send('Hello, World!');
    // const { title, content } = req.body;

    // Notr.create({
    //    title,
    //    content 
    // }, () => {
    //     res.sendStatus(201);
    // });
});

module.exports = router;