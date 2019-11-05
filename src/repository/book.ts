import { IBook } from '@model'
import { Document, model, Schema } from 'mongoose'
export interface IBookModel extends IBook, Document {
    title: string
    alias: string
    private: boolean
    user_Id: any
    workspace_Id: any
    createdAt: Date
    updateAt: Date
}
const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        alias: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        private: {
            type: Boolean,
            required: true,
            default: false
        },
        user_Id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        workspace_Id: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        }
    },
    {
        timestamps: true
    }
)
export const BookModel = model<IBookModel>('Book', bookSchema)
