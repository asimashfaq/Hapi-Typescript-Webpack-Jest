import { BaseHandler } from '@handler/base/BaseHandler'
import { logger } from '@lib/Logger'
import { IUser, UserModel } from '@repository/user'
import * as Boom from 'boom'
import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { RBAC } from 'rbac'

class UserHandler extends BaseHandler {
    constructor(request: Request, h: ResponseToolkit) {
        super(request, h)
    }

    public async create(): Promise<ResponseObject> {
        const userObj = new UserModel(this.request.payload)
        const enforcer = await RBAC()
        enforcer.addRoleForUser(userObj.id, 'user')
        await userObj.save()
        const token = await userObj.generateAuthToken()
        return this.respondSuccess(this.h.response({ user: userObj, token }))
    }
    public async userLogin(): Promise<ResponseObject> {
        const { email, password } = Object(this.request.payload)
        const result = await UserModel.findByCredentials(email, password)
        if (result.isBoom) {
            throw this.respondError(result)
        }
        return this.respondSuccess(this.h.response(result))
    }
    public async info(): Promise<ResponseObject> {
        const user = this.request.auth.credentials as any
        const userObj = (await UserModel.findById(user._id)) as IUser
        if (userObj !== null) {
            return this.respondSuccess(this.h.response(userObj))
        }
        throw Boom.notFound('User not found')
    }
    public async logout(): Promise<ResponseObject> {
        const auth = this.request.auth as any
        const userObj = (await UserModel.findById(
            auth.credentials._id
        )) as IUser
        if (userObj !== null) {
            logger.info(auth.token)
            userObj.tokens = userObj.tokens.filter(token => {
                return token.token !== auth.token
            })
            await userObj.save()
            return this.respondSuccess(this.h.response(userObj))
        }
        throw Boom.notFound('User not found')
    }
    public async logoutall(): Promise<ResponseObject> {
        const auth = this.request.auth as any
        const userObj = (await UserModel.findById(
            auth.credentials._id
        )) as IUser
        if (userObj.email !== '') {
            userObj.tokens = []
            await userObj.save()
            return this.respondSuccess(this.h.response(userObj))
        }
        throw Boom.notFound('User not found')
    }
}

export const create = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new UserHandler(request, h).create()
    } catch (e) {
        if (e.name === 'ValidationError') {
            throw Boom.badData(e.message)
        } else if (e.code === 11000) {
            throw Boom.conflict('Username or Email Already exists')
        }
        throw e
    }
}
export const login = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new UserHandler(request, h).userLogin()
    } catch (e) {
        throw e
    }
}

export const info = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new UserHandler(request, h).info()
    } catch (e) {
        throw e
    }
}

export const logout = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new UserHandler(request, h).logout()
    } catch (e) {
        throw e
    }
}

export const logoutall = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new UserHandler(request, h).logoutall()
    } catch (e) {
        throw e
    }
}
