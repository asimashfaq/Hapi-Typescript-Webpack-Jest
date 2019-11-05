import { IContent } from '@model/Content'
import { Document, model, Schema } from 'mongoose'

export interface IContentModel extends IContent, Document {
    title: string
    alias: string
    blocks: object
    raw: object
    user_Id: any
    workspace_Id: any
    book_Id: any
    createdAt: Date
    updateAt: Date
}
const contentSchema = new Schema(
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
        blocks: {
            type: Object,
            required: true
        },
        raw: {
            type: Object,
            required: true
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
export const ContentModel = model<IContentModel>('Content', contentSchema)
