import { IDatabase } from '@service/database'
import { Server } from 'hapi'

export interface IPlugin {
    register(server: Server, database?: IDatabase): Promise<void>
    info(): IPluginInfo
}

export interface IPluginInfo {
    name: string
    version: string
}
