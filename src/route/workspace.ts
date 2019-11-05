import * as wrokspace from '@handler/WorkspaceHandler'
import * as joiModels from '@model/joi'
import { ServerRoute } from 'hapi'
import * as joi from 'joi'
export const create: ServerRoute = {
    method: 'POST',
    path: '/workspace',
    handler: wrokspace.create,
    options: {
        description: 'Create New Workspace',
        auth: 'jwt',
        tags: ['api', 'Workspace'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Workspace created.',
                        schema: joiModels.workspaceRequest
                    },
                    409: {
                        description: 'Duplicate /error message'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.workspaceRequest,
            headers: joiModels.jwtValidator
        }
    }
}
export const list: ServerRoute = {
    method: 'GET',
    path: '/workspaces',
    handler: wrokspace.listWorkspaces,
    options: {
        description: 'List Workspace',
        auth: 'jwt',
        tags: ['api', 'Workspace'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'List Workspace'
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
                    .required()
            },
            headers: joiModels.jwtValidator
        }
    }
}
export const deleteWokspace: ServerRoute = {
    method: 'DELETE',
    path: '/workspace/{id}',
    handler: wrokspace.deleteWorkspace,
    options: {
        description: 'DELETE Workspace',
        auth: 'jwt',
        tags: ['api', 'Workspace'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Workspace delete.'
                    },
                    404: {
                        description: 'Not found'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.workspaceUpdateRequest,
            headers: joiModels.jwtValidator
        }
    }
}
export const updateWokspace: ServerRoute = {
    method: 'PUT',
    path: '/workspace/{id}',
    handler: wrokspace.updateWorkspace,
    options: {
        description: 'DELETE Workspace',
        auth: 'jwt',
        tags: ['api', 'Workspace'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Workspace delete.'
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
export const getWokspace: ServerRoute = {
    method: 'GET',
    path: '/workspace/{id}',
    handler: wrokspace.getWorkspace,
    options: {
        description: 'Get Workspace',
        auth: 'jwt',
        tags: ['api', 'Workspace'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Workspace delete.'
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
