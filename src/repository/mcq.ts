import { IAnswer, IBookMcqs, IQuestion } from '@model/MCQ'
import { Document, model, Schema } from 'mongoose'

export interface IQuestionModel extends IQuestion, Document {
    text: string
    user_Id: any
    workspace_Id: any
    is_active: boolean
    createdAt: Date
    updateAt: Date
}

export interface IAnswerModel extends IAnswer, Document {
    question_Id: any
    text: string
    is_correct: boolean
    createdAt: Date
    updateAt: Date
}

export interface IBookMcqsModel extends IBookMcqs, Document {
    book_Id: any
    question_Id: any
    order: number
    createdAt: Date
    updateAt: Date
}
const questionSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            index: true
        },
        user_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        workspace_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'workspaces'
        },
        is_active: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
)
const answerSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            index: true
        },
        question_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'questions'
        },
        is_correct: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const bookMcqSchema = new Schema(
    {
        question_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'questions'
        },
        book_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'books'
        }
    },
    {
        timestamps: true
    }
)
answerSchema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.is_correct
    delete obj.user_Id
    delete obj.workspace_Id
    return obj
}
export const QuestionModel = model<IQuestionModel>('Question', questionSchema)
export const AnswerModel = model<IAnswerModel>('Answer', answerSchema)

export const BookMcqModel = model<IBookMcqsModel>('BookMcqs', bookMcqSchema)
