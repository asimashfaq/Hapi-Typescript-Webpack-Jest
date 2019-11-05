import { BaseHandler } from '@handler/base/BaseHandler'
import { Rethrow } from '@lib/ExtendedError'
import { logger } from '@lib/Logger'
import * as Boom from 'boom'
import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { Types } from 'mongoose'
import { RBAC } from 'rbac'
import { ContentModel, IContentModel } from '../repository/content'
class ContentHandler extends BaseHandler {
    constructor(request: Request, h: ResponseToolkit) {
        super(request, h)
    }
    public async create(): Promise<ResponseObject> {
        try {
            const content = new ContentModel(this.request.payload)
            content.alias = content.title.replace(' ', '_')
            const user = this.request.auth.credentials as any
            content.user_Id = Types.ObjectId(Object(user)._id)
            const result = await content.save()
            const enforcer = await RBAC()
            // owner can write/update this book id
            enforcer.addPolicy(content.id, Object(user)._id, 'write')
            // workspace can read this book
            enforcer.addPolicy(content.id, Object(user)._id, 'read')
            enforcer.addPolicy(content.id, content.book_Id, 'read')
            return this.respondSuccess(this.h.response(result))
        } catch (e) {
            if (e.name === 'ValidationError') {
                throw Boom.badData(e.message)
            } else if (e.code === 11000) {
                throw Boom.conflict('Content Alias already exists')
            }
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }
    public async list(): Promise<ResponseObject> {
        try {
            const { limit, offset, book_Id } = this.request.query
            const user = this.request.auth.credentials as any
            const result = await ContentModel.find({
                user_Id: Types.ObjectId(Object(user)._id),
                book_Id: Types.ObjectId(book_Id.toString())
            })
                .lean(true)
                .skip(parseInt(offset as string, 10))
                .limit(parseInt(limit as string, 10))
            logger.info(result)
            return this.respondSuccess(this.h.response(result))
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
        return this.respondSuccess(this.h.response({}))
    }
    public async update(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id
            const user = this.request.auth.credentials as any
            const content = this.request.payload as IContentModel
            content.alias = content.title.replace(' ', '-')
            const result = (await ContentModel.findOneAndUpdate(
                {
                    _id: id,
                    user_Id: Types.ObjectId(Object(user)._id)
                },
                {
                    $set: {
                        title: content.title,
                        alias: content.alias
                    }
                }
            )) as IContentModel
            return this.respondSuccess(
                this.h.response({
                    old: result,
                    success: true
                })
            )
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
        return this.respondSuccess(this.h.response({}))
    }
    public async delete(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id
            const user = this.request.auth.credentials as any
            const result = await ContentModel.findOneAndRemove({
                _id: id,
                user_Id: Types.ObjectId(Object(user)._id)
            }).lean(true)
            if (result === '') {
                return this.h.response({ message: 'Not found' }).code(404)
            }
            return this.respondSuccess(this.h.response(result))
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
        return this.respondSuccess(this.h.response({}))
    }
    public async get(): Promise<ResponseObject> {
        try {
            const id = this.request.params.id
            const result = await ContentModel.findById(id).lean(true)
            if (result === '') {
                return this.h.response({ message: 'Not found' }).code(404)
            }
            return this.respondSuccess(this.h.response(result))
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }
}

export const createContent = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new ContentHandler(request, h).create()
    } catch (e) {
        throw e
    }
}
export const listContent = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new ContentHandler(request, h).list()
    } catch (e) {
        throw e
    }
}

export const deleteContent = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // book id
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new ContentHandler(request, h).delete()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}
export const updateContent = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // book id
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new ContentHandler(request, h).update()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}
export const getContent = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // content id
        if (enforcer.hasPolicy(id, Object(user)._id, 'read')) {
            return await new ContentHandler(request, h).get()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}
