import * as joi from 'joi'
export const workspaceRequest = joi.object().keys({
    name: joi.string().required(),
    private: joi.bool().required(),
    subscription: joi.number().required(),
    subscription_type: joi.string().required()
})

export const workspaceUpdateRequest = joi.object().keys({
    name: joi.string().required(),
    private: joi.bool().required(),
    subscription_type: joi.string().required()
})
