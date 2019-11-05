import { BaseHandler } from '@handler/base/BaseHandler'
import { Rethrow } from '@lib/ExtendedError'
import { logger } from '@lib/Logger'
import { IWorkspace } from '@model'
import * as Boom from 'boom'
import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { Types } from 'mongoose'
import { RBAC } from 'rbac'
import { WorkSpaceModel } from '../repository/workspace'
class WorkspaceHander extends BaseHandler {
    constructor(request: Request, h: ResponseToolkit) {
        super(request, h)
    }
    public async create(): Promise<ResponseObject> {
        const workspace = new WorkSpaceModel(this.request.payload)
        workspace.alias = workspace.name.replace(' ', '_')
        const user = this.request.auth.credentials as any
        try {
            workspace.admins.push(Types.ObjectId(Object(user)._id))
            logger.debug(workspace)
            const result = await workspace.save()
            const enforcer = await RBAC()
            enforcer.addRoleForUser(Object(user)._id, 'creator')
            enforcer.addPolicy(workspace.id, Object(user)._id, 'read')
            enforcer.addPolicy(workspace.id, Object(user)._id, 'write')
            logger.info(result)
            return this.respondSuccess(this.h.response(result))
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw Boom.badData(error.message)
            } else if (error.code === 11000) {
                throw Boom.illegal(
                    'you are not permitted to view this resource for legal reasons'
                )
            }
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
    public async list(): Promise<ResponseObject> {
        try {
            const { limit, offset } = this.request.query
            const user = this.request.auth.credentials as any
            const result = await WorkSpaceModel.find({
                admins: Types.ObjectId(Object(user)._id)
            })
                .lean(true)
                .skip(parseInt(offset as string, 10))
                .limit(parseInt(limit as string, 10))
            logger.info(result)
            return this.respondSuccess(this.h.response(result))
        } catch (error) {
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
    public async delete(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id
            const user = this.request.auth.credentials as any
            const result = await WorkSpaceModel.findOneAndRemove({
                _id: id,
                admins: Types.ObjectId(Object(user)._id)
            }).lean(true)
            if (result === '') {
                return this.h.response({ message: 'Not found' }).code(404)
            }
            return this.respondSuccess(this.h.response(result))
        } catch (error) {
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
    public async update(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id
            const user = this.request.auth.credentials as any
            const workspace = this.request.payload as IWorkspace
            workspace.alias = workspace.name.replace(' ', '-')
            const result = (await WorkSpaceModel.findOneAndUpdate(
                {
                    _id: id,
                    admins: Types.ObjectId(Object(user)._id)
                },
                {
                    $set: {
                        name: workspace.name,
                        alias: workspace.alias,
                        private: workspace.private,
                        subscription_type: workspace.subscription_type
                    }
                }
            )) as IWorkspace
            return this.respondSuccess(
                this.h.response({
                    old: result,
                    success: true
                })
            )
        } catch (error) {
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
    public async get(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id

            const result = (await WorkSpaceModel.findById(id)) as IWorkspace
            return this.respondSuccess(this.h.response(result))
        } catch (error) {
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
}
export const create = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new WorkspaceHander(request, h).create()
    } catch (e) {
        throw e
    }
}
export const listWorkspaces = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new WorkspaceHander(request, h).list()
    } catch (e) {
        throw e
    }
}
export const deleteWorkspace = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new WorkspaceHander(request, h).delete()
        }
        return await h
            .response({
                message: 'Your not allowed to access '
            })
            .code(403)
    } catch (e) {
        throw e
    }
}
export const updateWorkspace = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new WorkspaceHander(request, h).update()
        }
        return await h
            .response({
                message: 'Your not allowed to access '
            })
            .code(403)
    } catch (e) {
        throw e
    }
}
export const getWorkspace = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        if (enforcer.hasPolicy(id, Object(user)._id, 'read')) {
            return await new WorkspaceHander(request, h).get()
        }
        return await h
            .response({
                message: 'Your not allowed to access '
            })
            .code(403)
    } catch (e) {
        throw e
    }
}
