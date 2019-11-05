import * as merge from 'deepmerge'

export class ExtendedError extends Error {
    public options: ExtendedErrorOptions
    constructor(message: string, options?: ExtendedErrorOptions) {
        super(message)
        if (options) {
            this.options = options
        }
        this.name = this.constructor.name
        this.message = message
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = new Error(message).stack
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
export class Rethrow extends ExtendedError {
    public newStack: string | undefined
    public original: Error | ExtendedError | Rethrow
    constructor(
        message: string,
        error: Error | ExtendedError | Rethrow,
        options?: ExtendedErrorOptions
    ) {
        if (!error || !message) {
            throw new Error('Rethrow requires a message and error')
        }
        const errorOptions = (error as ExtendedError).options
        let originalOptions: string = ''
        if (errorOptions) {
            originalOptions = JSON.stringify(errorOptions)
            if (options) {
                super(message, merge(errorOptions, options))
            } else {
                super(message, errorOptions)
            }
        } else {
            if (options) {
                super(message, options)
            } else {
                super(message)
            }
        }
        this.original = error
        if (originalOptions) {
            ;(this.original as ExtendedError).options = JSON.parse(
                originalOptions
            )
        }
        this.newStack = this.stack
        const messageLines: number =
            (this.message.match(/\n/g) || []).length + 1
        if (this.stack) {
            this.stack = `${this.stack
                .split('\n')
                .slice(0, messageLines + 1)
                .join('\n')}\n${error.stack}`
        } else {
            this.stack = error.stack
        }
    }
}

// tslint:disable-next-line: interface-name
export interface ExtendedErrorOptions {
    http?: ExtendedErrorOptionsHttp
}

// tslint:disable-next-line: interface-name
interface ExtendedErrorOptionsHttp {
    statusCode?: number
    message?: string
    decorate?: any
    override?: any
}
