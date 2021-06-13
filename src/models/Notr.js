/* DEPENDENCIES: */
const mongoose = require('mongoose');
/* */

const notrSchema = mongoose.Schema({
    notr: {
        id: String,
        title: String,
        content: String
    }
});

module.exports = mongoose.model('Notr', notrSchema);