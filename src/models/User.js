/* DEPENDENCIES: */
const mongoose = require('mongoose');
/* */

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    notrs: {
        type: Array
    }
});

module.exports = mongoose.model('User', userSchema);