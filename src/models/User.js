/* DEPENDENCIES */
const mongoose = require('mongoose');
/* */

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
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
    permissionLevel: {
        type: Number,
        required: true
    },
    notrs: {
        type: Map
    }
});

module.exports = mongoose.model('User', userSchema);