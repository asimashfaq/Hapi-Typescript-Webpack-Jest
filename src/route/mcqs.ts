import * as mcq from '@handler/McqHandler'
import * as joiModels from '@model/joi'
import { ServerRoute } from 'hapi'

export const create: ServerRoute = {
    method: 'POST',
    path: '/mcq',
    handler: mcq.create,
    options: {
        description: 'Create New MCQ',
        auth: false,
        tags: ['api', 'mcq'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'MCQ create'
                    },
                    409: {
                        description: 'Duplicate /error message'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}

export const list: ServerRoute = {
    method: 'GET',
    path: '/mcq',
    handler: mcq.list,
    options: {
        description: 'Get MCQs',
        auth: false,
        tags: ['api', 'mcq'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'MCQ list'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}

export const deleteMcq: ServerRoute = {
    method: 'DELETE',
    path: '/mcq/{id}',
    handler: mcq.deleteMcq,
    options: {
        description: 'DELETE MCQs',
        auth: false,
        tags: ['api', 'mcq'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'MCQ DELETE'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}

export const getMcq: ServerRoute = {
    method: 'GET',
    path: '/mcq/{id}',
    handler: mcq.getMcq,
    options: {
        description: 'GET MCQs',
        auth: false,
        tags: ['api', 'mcq'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'MCQ GET'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}
