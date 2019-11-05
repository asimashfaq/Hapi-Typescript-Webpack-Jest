import * as joi from 'joi'
export const userResponse = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
})

export const userRequest = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
})

export const loginRequest = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required()
})

export const loginResponse = joi.object().keys({
    token: joi.string().required(),
    user: joi.object().required()
})

export const jwtValidator = joi
    .object({ authorization: joi.string().required() })
    .unknown()
