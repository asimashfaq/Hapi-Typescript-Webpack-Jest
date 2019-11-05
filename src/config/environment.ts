import * as convict from 'convict'
import { existsSync } from 'fs'

const convictConfig: any = convict({
    env: {
        doc: 'Environment',
        format: String,
        default: 'development',
        env: 'NODE_ENV'
    },
    envFilePath: {
        doc: 'Path to .env file',
        format: String,
        default: 'env.json',
        env: 'ENV_FILE_PATH'
    },
    name: {
        doc: 'Name of application',
        format: String,
        // tslint:disable-next-line:
        default: 'learnimpact',
        env: 'APP_NAME'
    },
    logLevel: {
        doc: 'Bunyan log level',
        format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
        default: 'debug',
        env: 'LOG_LEVEL'
    },
    enableLogs: {
        doc: 'Flag to turn on logging',
        format: Boolean,
        default: true,
        env: 'ENABLE_LOGS'
    },
    host: {
        doc: 'Hostname or IP address the server will listen on',
        format: String,
        default: '0.0.0.0',
        env: 'HOST'
    },
    port: {
        doc: 'Port the server will listen on',
        format: 'port',
        default: 8000,
        env: 'PORT'
    },
    protocol: {
        doc: 'Protocol used',
        format: ['http', 'https', 'socket'],
        default: 'http',
        env: 'PROTOCOL'
    },
    mongoUrl: {
        doc: 'Mongodb Url',
        format: '*',
        default: '-',
        env: 'MONGO_URL'
    },
    jwtToken: {
        doc: 'JWT Secret',
        format: '*',
        default: '-',
        env: 'JWT_TOKEN'
    }
})

if (
    convictConfig.get('env') === 'development' &&
    existsSync(convictConfig.get('envFilePath'))
) {
    convictConfig.loadFile(convictConfig.get('envFilePath'))
}

convictConfig.validate({ allowed: 'strict' })

export const config: convict.Config<{}> = convictConfig
