import { config } from '@config/environment'
import { User } from '@model'
import * as Bcrypt from 'bcryptjs'
import * as Boom from 'boom'
import * as jwt from 'jsonwebtoken'
import { Document, Model, model, Schema } from 'mongoose'
export interface IToken {
    token: string
}
export interface IUser extends User, Document {
    name: string
    email: string
    password: string
    createdAt: Date
    updateAt: Date
    tokens: IToken[]
    validatePassword(requestPassword: any): boolean
    generateAuthToken(): string
}
export interface IUserModal extends Model<IUser> {
    findByCredentials(email: string, password: string): any
}

export const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            index: true
        },
        name: { type: String, required: true, minLength: 7 },
        password: { type: String, required: true },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

function hashPassword(password: string): string {
    if (!password) {
        return ''
    }

    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8))
}

userSchema.methods.validatePassword = function(requestPassword: string) {
    return Bcrypt.compareSync(requestPassword, this.password)
}

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    // tslint:disable-next-line: no-this-assignment
    const user = this
    const token = jwt.sign({ _id: user._id }, config.get('jwtToken'))
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    // tslint:disable-next-line: no-this-assignment

    const user = await UserModel.findOne({ email })
    if (!user) {
        return Boom.unauthorized('User does not exists.')
    }
    if (!user.validatePassword(password)) {
        return Boom.unauthorized('Password is invalid.')
    }
    return { token: await user.generateAuthToken(), user }
}

userSchema.pre('save', function(next) {
    // tslint:disable-next-line: no-this-assignment
    const user = this as IUser
    if (!user.isModified('password')) {
        return next()
    }
    user.password = hashPassword(user.password)
    return next()
})
userSchema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    delete obj.tokens
    return obj
}
// tslint:disable-next-line: variable-name
export const UserModel = model<IUser, IUserModal>('User', userSchema)
