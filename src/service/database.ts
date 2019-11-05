import { config } from '@config/environment'
import { IUser, UserModel } from '@repository/user'
import * as Mongoose from 'mongoose'
export interface IDatabase {
    userModel: Mongoose.Model<IUser>
}

export function init(): IDatabase {
    ;(Mongoose as any).Promise = Promise

    Mongoose.connect(process.env.MONGO_URL || config.get('mongoUrl'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    })

    const mongoDb = Mongoose.connection

    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.get('mongoUrl')}`)
    })

    mongoDb.once('open', () => {
        console.log('Connected to database')
    })
    return {
        userModel: UserModel
    }
}
