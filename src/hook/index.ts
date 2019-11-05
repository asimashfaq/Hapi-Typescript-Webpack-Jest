import { onPreResponse } from '@hook/onPreResponse'
import { onRequest } from '@hook/onRequest'
import { ServerExtEventsRequestObject } from 'hapi'

export const hooks: ServerExtEventsRequestObject[] = [onRequest, onPreResponse]
