import { logger } from '@lib/Logger'
import { ResponseObject, ServerExtEventsRequestObject } from 'hapi'

export const onPreResponse: ServerExtEventsRequestObject = {
    type: 'onPreResponse',
    method: (request, h) => {
        if (request.response && (request.response as any).isBoom) {
            const response: any = request.response as any
            logger.trace('Full Error Object:')
            logger.trace(response)
            if (
                response.output &&
                response.output.payload &&
                Object.keys(response.output.payload).length !== 0
            ) {
                logger.error('Error Payload:')
                logger.error(response.output.payload)
            }
            if (
                response.output &&
                response.output.headers &&
                Object.keys(response.output.headers).length !== 0
            ) {
                logger.error('Error Headers:')
                logger.error(response.output.headers)
            }
            if (response.output && response.output.statusCode) {
                logger.error('Error Status Code:')
                logger.error(response.output.statusCode)
            }
        } else {
            const response: ResponseObject = request.response as ResponseObject
            logger.trace('Full Response Object:')
            logger.trace(response)
            if (response.source) {
                logger.debug('Response Payload:')
                logger.debug(response.source)
            }
            if (
                response.headers &&
                Object.keys(response.headers).length !== 0
            ) {
                logger.debug('Response Headers:')
                logger.debug(response.headers)
            }
            if (response.statusCode) {
                logger.debug('Response Status Code:')
                logger.debug(response.statusCode)
            }
            if (response.app && Object.keys(response.app).length !== 0) {
                logger.debug('Response Application State:')
                logger.debug(response.app)
            }
        }
        if (!request.path.includes('swagger')) {
            logger.info(`End: ${request.method.toUpperCase()} ${request.path}`)
        } else {
            logger.debug(`End: ${request.method.toUpperCase()} ${request.path}`)
        }
        return h.continue
    }
}
