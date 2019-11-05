import { config as env } from '@config/environment'
import { IPlugin } from '@lib/Interfaces'
import { logger } from '@lib/Logger'
import { IDatabase } from '@service/database'
import { ResponseToolkit, Server } from 'hapi'
const register = async (server: Server, database: IDatabase): Promise<void> => {
    try {
        const validateUser = async (
            decoded: any,
            request: any,
            h: ResponseToolkit
        ) => {
            try {
                const user = await database.userModel.findOne({
                    _id: decoded._id,
                    'tokens.token': request.auth.token
                })
                if (!user) {
                    logger.debug('Invalid User')
                    return { isValid: false }
                }
                return { isValid: true }
            } catch (e) {
                logger.debug(' Inside Jwt Validator')
                logger.error(e)
            }
        }

        await server.register(require('hapi-auth-jwt2'))

        return setAuthStrategy(server, {
            config: {
                jwtExpiration: '1h'
            },
            validate: validateUser
        })
    } catch (err) {
        throw err
    }
}

const setAuthStrategy = async (server, { config, validate }) => {
    server.auth.strategy('jwt', 'jwt', {
        key: env.get('jwtToken'),
        validate,
        verifyOptions: {
            algorithms: ['HS256']
        }
    })

    server.auth.default('jwt')
    return
}
export default (): IPlugin => ({
    register,
    info: () => {
        return { name: 'JWT Authentication', version: '1.0.0' }
    }
})
