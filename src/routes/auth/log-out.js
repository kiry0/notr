/* DEPENDENCIES: */
const express = require('express');
const router = express.Router();
/* */

router.delete('/api/v1/auth/log-out', (req, res) => {
    if(!req.session.isLoggedIn) return res.sendStatus(404);

    req.session.destroy();

    res.sendStatus(200);
});

module.exports = router;