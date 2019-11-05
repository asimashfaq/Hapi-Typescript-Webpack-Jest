import * as user from '@handler/UserHandler'
import * as joiModels from '@model/joi'
import { ServerRoute } from 'hapi'

export const create: ServerRoute = {
    method: 'POST',
    path: '/users',
    handler: user.create,
    options: {
        description: 'Create New User',
        auth: false,
        tags: ['api', 'user'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'User created.',
                        schema: joiModels.userResponse
                    },
                    409: {
                        description: 'Duplicate /error message'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.userRequest
        }
    }
}

export const login: ServerRoute = {
    method: 'POST',
    path: '/users/login',
    handler: user.login,
    options: {
        description: 'User Login',
        tags: ['api', 'user'],
        auth: false,
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Login Success Fully',
                        schema: joiModels.loginResponse
                    },
                    403: {
                        description: 'Invalid Login'
                    }
                }
            }
        },
        validate: {
            payload: joiModels.loginRequest
        }
    }
}

export const info: ServerRoute = {
    method: 'GET',
    path: '/users/me',
    handler: user.info,
    options: {
        description: 'User Info',
        tags: ['api', 'user'],
        auth: 'jwt',
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Get user info',
                        schema: joiModels.loginResponse
                    },
                    403: {
                        description: 'Un authorizied'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}
export const logout: ServerRoute = {
    method: 'GET',
    path: '/users/logout',
    handler: user.logout,
    options: {
        description: 'User logout',
        tags: ['api', 'user'],
        auth: 'jwt',
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'User logout',
                        schema: joiModels.loginResponse
                    },
                    403: {
                        description: 'Un authorizied'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}

export const logoutall: ServerRoute = {
    method: 'GET',
    path: '/users/logoutall',
    handler: user.logoutall,
    options: {
        description: 'User logout Add devices',
        tags: ['api', 'user'],
        auth: 'jwt',
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'User logout All Devices',
                        schema: joiModels.loginResponse
                    },
                    403: {
                        description: 'Un authorizied'
                    }
                }
            }
        },
        validate: {
            headers: joiModels.jwtValidator
        }
    }
}
