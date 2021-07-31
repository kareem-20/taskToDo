const joi = require('joi');

const signSchema = joi.object({
    userName: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).required()
})

const loginSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).required()
})

module.exports = {
    signSchema,
    loginSchema
}