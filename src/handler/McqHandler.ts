import { Rethrow } from '@lib/ExtendedError'
import { IMCQ } from '@model/MCQ'
import { AnswerModel, BookMcqModel, QuestionModel } from '@repository/mcq'
import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { Types } from 'mongoose'
import { BaseHandler } from './base/BaseHandler'

class McqHander extends BaseHandler {
    constructor(request: Request, h: ResponseToolkit) {
        super(request, h)
    }
    public async create(): Promise<ResponseObject> {
        let question
        let answers
        let bookMcq
        try {
            const data = this.request.payload as IMCQ
            const user = this.request.auth.credentials as any

            question = new QuestionModel({
                text: data.text,
                user_Id: Types.ObjectId(Object(user)._id),
                workspace_Id: data.workspace_Id,
                is_active: data.is_active
            })

            answers = []
            data.answers.forEach(answer => {
                const answerData = new AnswerModel({
                    question_Id: question._id,
                    text: answer.text,
                    is_correct: answer.is_correct
                })
                answers.push(answerData)
            })
            bookMcq = new BookMcqModel({
                book_Id: data.book_Id,
                order: data.order,
                question_Id: question._id
            })
            const resultQuestion = await question.save()
            const resultBookMcq = await bookMcq.save()
            const resultAnswers = await AnswerModel.insertMany(answers)

            return this.respondSuccess(
                this.h.response({
                    question: resultQuestion,
                    answers: resultAnswers,
                    mcqs: resultBookMcq
                })
            )
        } catch (e) {
            question.remove()
            bookMcq.remove()
            answers.forEach(answer => {
                answer.remove()
            })
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }
    public async list(): Promise<ResponseObject> {
        const { limit, offset, book_Id, workspace_Id } = this.request.query

        try {
            const data = this.request.payload as IMCQ
            const user = this.request.auth.credentials as any
            console.log(book_Id)
            const questions = await BookMcqModel.aggregate([
                {
                    $lookup: {
                        from: 'questions',
                        localField: 'question_Id',
                        foreignField: '_id',
                        as: 'questions'
                    }
                },
                { $unwind: '$questions' },
                {
                    $match: {
                        book_Id: Types.ObjectId(book_Id.toString())
                    }
                },
                {
                    $project: {
                        _id: 1,
                        question_Id: 1,
                        text: '$questions.text'
                    }
                }
            ])
                .skip(parseInt(offset as string, 10))
                .limit(parseInt(limit as string, 10))
            return this.respondSuccess(this.h.response(questions))
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }

    public async delete(): Promise<ResponseObject> {
        const id = this.request.params.id

        try {
            const data = this.request.payload as IMCQ
            const user = this.request.auth.credentials as any
            await BookMcqModel.deleteMany({
                question_Id: Types.ObjectId(id)
            })
            await QuestionModel.deleteOne({
                _id: Types.ObjectId(id)
            })
            await AnswerModel.deleteMany({
                question_Id: Types.ObjectId(id)
            })
            return this.respondSuccess(
                this.h.response({
                    success: true
                })
            )
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }
    public async deleteMcqFromBookOnly(): Promise<ResponseObject> {
        const id = this.request.params.id
        const book_Id = this.request.params.book_Id

        try {
            const data = this.request.payload as IMCQ
            const user = this.request.auth.credentials as any
            await BookMcqModel.deleteOne({
                question_Id: Types.ObjectId(id),
                book_Id: Types.ObjectId(book_Id)
            })

            return this.respondSuccess(
                this.h.response({
                    success: true
                })
            )
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }

    public async get(): Promise<ResponseObject> {
        const id = this.request.params.id

        try {
            const data = this.request.payload as IMCQ
            const user = this.request.auth.credentials as any
            const question = (await QuestionModel.findById(
                Types.ObjectId(id.toString())
            )) as any
            const answers = await AnswerModel.find({
                question_Id: Types.ObjectId(id.toString())
            })

            return this.respondSuccess(
                this.h.response({
                    ...question._doc,
                    options: answers
                })
            )
        } catch (e) {
            this.respondError(e)
            throw new Rethrow('Something went wrong', e)
        }
    }
}
export const list = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new McqHander(request, h).list()
    } catch (e) {
        throw e
    }
}

export const create = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new McqHander(request, h).create()
    } catch (e) {
        throw e
    }
}

export const deleteMcq = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new McqHander(request, h).delete()
    } catch (e) {
        throw e
    }
}
export const deleteMcqFromBookOnly = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new McqHander(request, h).deleteMcqFromBookOnly()
    } catch (e) {
        throw e
    }
}

export const getMcq = async (
    request: Request,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        return await new McqHander(request, h).get()
    } catch (e) {
        throw e
    }
}
