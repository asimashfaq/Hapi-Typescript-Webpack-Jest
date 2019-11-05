import { config } from '@config/environment'
import * as vision from '@hapi/vision'
import { ServerRegisterPluginObject } from 'hapi'
import * as hapiSwagger from 'hapi-swagger'
import * as inert from 'inert'
export const plugins: Array<ServerRegisterPluginObject<any>> = [
    {
        plugin: vision
    },
    {
        plugin: inert
    },
    {
        plugin: hapiSwagger,
        options: {
            info: {
                title: 'API Documentation',
                description: 'Description goes here',
                version: '1.0.0'
            },
            schemes: [config.get('protocol')]
        }
    }
]
