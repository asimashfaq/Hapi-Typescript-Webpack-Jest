import { IWorkspace } from '@model'
import { Document, model, Schema } from 'mongoose'

export interface IWorkspaceModel extends IWorkspace, Document {
    name: string
    alias: string
    subscription: number
    subscription_type: string
    private: boolean
    admins: any[]
    peoples: string[]
    createdAt: Date
    updateAt: Date
}
const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        alias: {
            type: String,
            required: true,
            lowercase: true
        },
        subscription_type: {
            type: String,
            required: true,
            index: true,
            lowercase: true
        },
        private: {
            type: Boolean,
            required: true,
            default: false
        },
        subscription: {
            type: Number,
            required: true,
            lowercase: true
        },
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        ],
        people: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        ]
    },
    {
        timestamps: true
    }
)
export const WorkSpaceModel = model<IWorkspaceModel>(
    'Workspace',
    workspaceSchema
)
