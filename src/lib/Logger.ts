import { config } from '@config/environment'
import * as bunyan from 'bunyan'
import * as bunyanDebugStream from 'bunyan-debug-stream'
import { inspect } from 'util'

export class Logger {
    protected bunyanLogger: bunyan

    constructor(env: string, logLevel: bunyan.LogLevel, appName: string) {
        let bunyanLoggerOptions: bunyan.LoggerOptions

        if (env === 'development' || env === 'unit_test') {
            bunyanLoggerOptions = {
                name: appName,
                level: logLevel,
                context: null,
                src: true,
                streams: [
                    {
                        level: logLevel,
                        type: 'raw',
                        stream: bunyanDebugStream({
                            forceColor: true,
                            stringifiers: {
                                message: message => {
                                    let output: string
                                    if (
                                        message &&
                                        typeof message === 'object'
                                    ) {
                                        output = inspect(message, { depth: 5 })
                                    } else {
                                        output = message
                                    }
                                    return `${output}`
                                }
                            }
                        })
                    }
                ],
                serializers: bunyanDebugStream.serializers
            }
        } else {
            bunyanLoggerOptions = {
                name: appName,
                level: logLevel,
                context: null
            }
        }

        this.bunyanLogger = bunyan.createLogger(bunyanLoggerOptions)
    }
    public setContext(context: any): void {
        this.bunyanLogger.fields.context = context
    }

    public getContext(): any {
        return this.bunyanLogger.fields.context
    }

    public fatal(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.fatal({ message })
        }
    }

    public error(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.error({ message })
        }
    }

    public warn(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.warn({ message })
        }
    }

    public info(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.info({ message })
        }
    }

    public debug(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.debug({ message })
        }
    }

    public trace(message: any): void {
        if (config.get('enableLogs')) {
            this.bunyanLogger.trace({ message })
        }
    }
}

export const logger = new Logger(
    config.get('env'),
    config.get('logLevel'),
    config.get('name')
)
