import { BaseHandler } from '@handler/base/BaseHandler'
import { Rethrow } from '@lib/ExtendedError'
import { logger } from '@lib/Logger'
import { IBook } from '@model'
import * as Boom from 'boom'
import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { Types } from 'mongoose'
import { RBAC } from 'rbac'
import { BookModel } from '../repository/book'

class BookHander extends BaseHandler {
    constructor(request: Request, h: ResponseToolkit) {
        super(request, h)
    }
    public async create(): Promise<ResponseObject> {
        const book = new BookModel(this.request.payload)
        book.alias = book.title.replace(' ', '_')
        const user = this.request.auth.credentials as any
        try {
            book.user_Id = Types.ObjectId(Object(user)._id)
            logger.debug(book)
            const result = await book.save()
            const enforcer = await RBAC()
            // owner can write/update this book id
            enforcer.addPolicy(book.id, Object(user)._id, 'write')
            // workspace can read this book
            enforcer.addPolicy(book.id, Object(user)._id, 'read')
            enforcer.addPolicy(book.id, book.workspace_Id, 'read')
            // enforcer.addGroupingPolicy(book.id,'subscribers','read')
            // group(user,workspace, read)
            logger.info(result)
            return this.respondSuccess(this.h.response(result))
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw Boom.badData(error.message)
            } else if (error.code === 11000) {
                throw Boom.conflict('Book alias Duplication')
            }
            this.respondError(error)
            throw new Rethrow('Something went wrong', error)
        }
    }
    // Books can be loaded via Workspace only
    public async list(): Promise<ResponseObject> {
        try {
            const { limit, offset, all, workspace_Id } = this.request.query
            let filter = {}
            // TODO Super admin check
            if (all !== 'true') {
                const user = this.request.auth.credentials as any
                const enforcer = await RBAC()

                if (
                    !enforcer.hasPolicy(
                        workspace_Id.toString(),
                        Object(user)._id,
                        'read'
                    )
                ) {
                    throw Boom.illegal(
                        'you are not permitted to view this resource for legal reasons'
                    )
                }
                filter = { workspace_Id }
            }

            const result = await BookModel.find(filter)
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
            const result = await BookModel.findOneAndRemove({
                _id: id,
                user_Id: Types.ObjectId(Object(user)._id)
            }).lean(true)
            if (result === '') {
                throw Boom.notFound('Book not found')
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
            const book = this.request.payload as IBook
            book.alias = book.title.replace(' ', '-')
            const result = (await BookModel.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $set: {
                        title: book.title,
                        alias: book.alias,
                        private: book.private
                    }
                }
            )) as IBook
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
            const result = await BookModel.findById(id).lean(true)
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
        return await new BookHander(request, h).create()
    } catch (e) {
        throw e
    }
}
export const listBook = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new BookHander(request, h).list()
    } catch (e) {
        throw e
    }
}

export const deleteBook = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // book id
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new BookHander(request, h).delete()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}
export const updateBook = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // book id
        if (enforcer.hasPolicy(id, Object(user)._id, 'write')) {
            return await new BookHander(request, h).update()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}

export const getBook = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const enforcer = await RBAC()
        const id = request.params.id
        const user = request.auth.credentials as any
        // book id
        if (enforcer.hasPolicy(id, Object(user)._id, 'read')) {
            return await new BookHander(request, h).get()
        }
        throw Boom.illegal(
            'you are not permitted to view this resource for legal reasons'
        )
    } catch (e) {
        throw e
    }
}
