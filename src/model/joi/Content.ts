import * as joi from 'joi'
export const contentRequest = joi.object().keys({
    title: joi.string().required(),
    workspace_Id: joi.string().required(),
    book_Id: joi.string().required(),
    raw: joi.object().required(),
    blocks: joi.array().required()
})

export const contentUpdateRequest = joi.object().keys({
    title: joi.string().required()
})
