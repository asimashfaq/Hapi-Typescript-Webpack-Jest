import { config } from '@config/environment'
import * as MongooseAdapter from '@elastic.io/casbin-mongoose-adapter'
import { Enforcer, newEnforcer } from 'casbin'
import * as path from 'path'
let enforcer: Enforcer
export const RBAC = async (): Promise<Enforcer> => {
    if (enforcer === undefined) {
        const model = path.resolve(__dirname, './model.conf')
        const adapter = await MongooseAdapter.newAdapter(config.get('mongoUrl'))
        enforcer = await newEnforcer(model, adapter)
    }
    return enforcer
}
