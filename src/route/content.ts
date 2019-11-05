import * as content from '@handler/ContentHandler'
import * as joiModels from '@model/joi'
import { ServerRoute } from 'hapi'
import * as joi from 'joi'
export const create: ServerRoute = {
    method: 'POST',
    path: '/content',
    handler: content.createContent,
    options: {
        description: 'Create New content',
        auth: 'jwt',
        tags: ['api', 'content'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'content created.'
                    },
                    409: {
                        description: 'Duplicate /error message'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator,
            payload: joiModels.contentRequest
        }
    }
}
export const list: ServerRoute = {
    method: 'GET',
    path: '/content',
    handler: content.listContent,
    options: {
        description: 'List content',
        auth: 'jwt',
        tags: ['api', 'content'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'List content'
                    }
                }
            }
        },
        validate: {
            query: {
                limit: joi
                    .number()
                    .integer()
                    .min(1)
                    .default(20)
                    .required(),
                offset: joi
                    .number()
                    .integer()
                    .min(0)
                    .default(0)
                    .required(),
                workspace_Id: joi.string().required(),
                book_Id: joi.string().required()
            },
            headers: joiModels.jwtValidator
        }
    }
}
export const deleteContent: ServerRoute = {
    method: 'DELETE',
    path: '/content/{id}',
    handler: content.deleteContent,
    options: {
        description: 'DELETE content',
        auth: 'jwt',
        tags: ['api', 'content'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'content delete.'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}

export const updateContent: ServerRoute = {
    method: 'PUT',
    path: '/content/{id}',
    handler: content.updateContent,
    options: {
        description: 'Update content',
        auth: 'jwt',
        tags: ['api', 'content'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Content Update'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.contentUpdateRequest,
            headers: joiModels.jwtValidator
        }
    }
}

export const getContent: ServerRoute = {
    method: 'GET',
    path: '/content/{id}',
    handler: content.getContent,
    options: {
        description: 'GET content',
        auth: 'jwt',
        tags: ['api', 'content'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'content GET.'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}
