/* DEPENDENCIES: */
const joi = require('joi');
/* */

const registrationSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    username: joi.string().min(4).required(),
    password: joi.string().min(9).required()
});

const logInSchema = joi.alternatives([joi.string().email(), joi.string().min(4), joi.string().min(9).required()]);

module.exports = {
    registrationSchema,
    logInSchema
};

/* */
// const loginSchema = joi.object({
//     email: joi.string().email().lowercase().empty(''),
//     username: joi.string().min(4).when('email', { is: '', then: joi.required() }),
//     password: joi.string().min(9).required()
// });
/* */