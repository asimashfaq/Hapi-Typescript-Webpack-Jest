import { config } from '@config/environment'
import { globalRouteOptions } from '@config/gobalRouteOptions'
import jwt from '@config/jwt'
import { plugins } from '@config/plugins'
import { setSignals } from '@config/signals'
import { hooks } from '@hook'
import { Rethrow } from '@lib/ExtendedError'
import { logger } from '@lib/Logger'
import { routes } from '@route'
import { IDatabase, init as DB_INIT } from '@service/database'
import { Server } from 'hapi'
import { RBAC } from './rbac'
logger.setContext('boot')

let server: Server

async function main(): Promise<void> {
    try {
        server = new Server({
            host: config.get('host'),
            port: config.get('port'),
            routes: globalRouteOptions
        })
        if (server.info) {
            server.info.protocol = config.get('protocol')
        } else {
            throw new Error('Server info is null')
        }
    } catch (e) {
        throw new Rethrow('Problem creating server', e)
    }
    let db: IDatabase
    try {
        db = await DB_INIT()
        const enforcer = await RBAC()
    } catch (e) {
        throw new Rethrow('Problem with db connection', e)
    }

    try {
        await server.register(plugins)
        await jwt().register(server, db)
    } catch (e) {
        throw new Rethrow('Problem registering plugins', e)
    }

    try {
        await server.ext(hooks)
    } catch (e) {
        throw new Rethrow('Problem creating lifecycle hooks', e)
    }

    try {
        server.route(routes)
    } catch (e) {
        throw new Rethrow('Problem creating routes', e)
    }

    try {
        await server.start()
    } catch (e) {
        throw new Rethrow('Problem starting server', e)
    }

    try {
        setSignals(server)
    } catch (e) {
        throw new Rethrow('Problem setting system signals', e)
    }
}

// Execute main function
main()
    .then(() => {
        logger.info(`Server started at: ${server.info.uri}`)
        logger.info(`API docs available at: ${server.info.uri}/documentation`)
    })
    .catch(e => {
        logger.setContext('shutdown')
        logger.fatal('Fatal error during init:')
        logger.fatal(e.stack)
        process.exit(1)
    })
