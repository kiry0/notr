/* DEPENDENCIES: */
const mongoose = require('mongoose');
/* */

const notrSchema = mongoose.Schema({
    id: String,
    title: String,
    content: String
});

module.exports = mongoose.model('Notr', notrSchema);