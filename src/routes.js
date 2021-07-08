/* DEPENDENCIES: */
    /* ROUTES */
    const auth = require('./routes/auth.js'),
          notr = require('./routes/notr.js');
    /* */
/* */

module.exports = (app) => {
    app.use(auth)
       .use(notr);
};