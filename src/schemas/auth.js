/* DEPENDENCIES */
const joi = require('joi');
/* */

const signUp = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    emailAddress: joi.string().email().lowercase().required(),
    username: joi.string().min(4).required(),
    password: joi.string().min(9).required()
});

const logIn = joi.object({
    emailAddress: joi.string().email().lowercase().empty(''),
    username: joi.string().min(4).when('email', { is: '', then: joi.required() }),
    password: joi.string().min(9).required()
});

module.exports = {
    signUp,
    logIn
};

/* */
// const loginSchema = joi.object({
//     email: joi.string().email().lowercase().empty(''),
//     username: joi.string().min(4).when('email', { is: '', then: joi.required() }),
//     password: joi.string().min(9).required()
// });
/* */