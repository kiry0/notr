/* DEPENDENCIES */
const mongoose = require('mongoose');
/* */

const notrSchema = mongoose.Schema({
    title: String,
    content: String
});

module.exports = mongoose.model('Notr', notrSchema);