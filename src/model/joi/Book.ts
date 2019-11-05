import * as joi from 'joi'
export const bookRequest = joi.object().keys({
    title: joi.string().required(),
    private: joi.bool().required(),
    workspace_Id: joi.string().required()
})

export const bookUpdateRequest = joi.object().keys({
    title: joi.string().required(),
    private: joi.bool().required()
})
