/* DEPENDENCIES: */
const express = require('express'),
      router = express.Router(),
      { v4: uuidv4 } = require('uuid');
    /* MIDDLEWARES: */
    const reqsAuth = require('../middlewares/reqsAuth.js'),
          limiter = require('../middlewares/limiter.js');
    /* */
    /* MODELS: */
    const Notr = require('../models/Notr.js'),
          User = require('../models/User.js');
    /* */
/* */

/* Creates a notr. */
router.post('/api/v1/notr', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async (req, res) => {
    const token = req.headers.authorization || req.session.token,
          { title, content } = req.body,
          id = uuidv4(),
          notr = {
            title,
            content
          };

    Notr.create({
        id,
        title,
        content
    }, (err, doc) => {
        if(err) return res.sendStatus(400);

        if(!title && !content) return res.sendStatus(204);

        User.findOneAndUpdate(token, {
            'notrs': new Map([[id, notr]])
        }, {
            new: true
        }, () => {
            return res.sendStatus(201);
        });
    });
});
/* */

/* List a user's notr. */
// Add extra security.
router.get('/api/v1/user/:_id/notr/:id', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async (req, res) => {
    const { _id, id } = req.params;

    User.findById({ _id }, (err, user) => {
        if(err) return res.sendStatus(500);

        if(!user) return res.sendStatus(404);

        const notr = user.notrs.get(id);

        if(user.notrs.size >= 0) return res.sendStatus(204);

        res.status(200).send(notr);
    });
});
/* */

/* List a user's notrs. */
// Add extra security.
router.get('/api/v1/user/:_id/notrs', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async (req, res) => {
    const { _id } = req.params;
    
    if(!_id) return res.sendStatus(400);

    const user = await User.findById({ _id });

    if(!user) return res.sendStatus(404);

    const notrs = user.notrs;

    if(notrs.length <= 0) return res.sendStatus(204);

    res.status(200).send(notrs);
});
/* */

/* Updates a user's notr. */
router.patch('/api/v1/user/:_id/notr/:id', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async(req, res) => {
    const { _id, id } = req.params,
          notr = (await User.findById({_id})).notrs.get(id),
          { title, content } = req.body || notr;
    
    User.findByIdAndUpdate({ _id }, {
        $set: {[`notrs.${id}`]: { title, content }, }
    }, (err, user) => {
        if(err) return res.sendStatus(500);
       
        if(!user) return res.sendStatus(404);

        const notr = user.notrs.get(id);

        if(!notr) return res.sendStatus(404);
        
        res.sendStatus(200);
    });
});

router.put('/api/v1/user/:_id/notr/:id', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async(req, res) => {
    const { _id, id } = req.params,
          notr = (await User.findById({_id})).notrs.get(id),
        { title, content } = req.body || notr;

    User.findByIdAndUpdate({ _id }, {
        $set: {[`notrs.${id}`]: { title, content }, }
    }, (err, user) => {
        if(err) return res.sendStatus(500);
       
        if(!user) return res.sendStatus(404);

        const doesNotrExist = user.notrs.get(id) ? true : false;

        if(!doesNotrExist) {
            const id = uuidv4();

            Notr.create({
                id,
                title,
                content
            }, (err, doc) => {
                if(err) return res.sendStatus(400);
        
                if(!title && !content) return res.sendStatus(204);
        
                User.findOneAndUpdate(token, {
                    'notrs': new Map([[id, { title, content }]])
                }, {
                    new: true
                }, () => {
                    return res.sendStatus(201);
                });
            });
        };
        
        res.sendStatus(200);
    });
});
/* */

/* Deletes a user's notr. */
router.delete('/api/v1/user/:_id/notr/:id', [reqsAuth(), limiter({ tokens: 2, interval: 10 })], async(req, res) => {
    const { _id, id } = req.params;

    if(!_id) return res.sendStatus(400);

    User.findByIdAndUpdate({ _id }, {
        $unset: { notrs: { id } }
    }, (err, user) => {
        if(err) return res.sendStatus(500);
       
        if(!user) return res.sendStatus(404);

        const notr = user.notrs.get(id);

        if(!notr) return res.sendStatus(404);
        
        res.sendStatus(200);
    });
});
/* */
module.exports = router;