import * as book from '@handler/BookHandler'
import * as mcq from '@handler/McqHandler'
import * as joiModels from '@model/joi'
import { ServerRoute } from 'hapi'
import * as joi from 'joi'
export const create: ServerRoute = {
    method: 'POST',
    path: '/book',
    handler: book.create,
    options: {
        description: 'Create New book',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Workspace book.'
                    },
                    409: {
                        description: 'Duplicate /error message'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.bookRequest,
            headers: joiModels.jwtValidator
        }
    }
}
export const list: ServerRoute = {
    method: 'GET',
    path: '/book',
    handler: book.listBook,
    options: {
        description: 'List book',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'List book'
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
                workspace_Id: joi.string().required()
            },
            headers: joiModels.jwtValidator
        }
    }
}
export const deleteBook: ServerRoute = {
    method: 'DELETE',
    path: '/book/{id}',
    handler: book.deleteBook,
    options: {
        description: 'DELETE book',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'book delete.'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        }
    }
}
export const deleteBookMcq: ServerRoute = {
    method: 'DELETE',
    path: '/book/mcq/{id}',
    handler: mcq.deleteMcqFromBookOnly,
    options: {
        description: 'DELETE book MCQ',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'DELETE book MCQ'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        }
    }
}

export const updateBook: ServerRoute = {
    method: 'PUT',
    path: '/book/{id}',
    handler: book.updateBook,
    options: {
        description: 'DELETE book',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'book delete.'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.bookUpdateRequest,
            headers: joiModels.jwtValidator
        }
    }
}
export const getBook: ServerRoute = {
    method: 'GET',
    path: '/book/{id}',
    handler: book.getBook,
    options: {
        description: 'GET book',
        auth: 'jwt',
        tags: ['api', 'book'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'book delete.'
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
