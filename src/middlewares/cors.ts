/*
 * @Author: CKJiang 
 * @Date: 2022-08-12 16:03:22 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-13 09:15:37
 */

import koaCors from '@koa/cors'
import Config from '../config'

const corsOptions = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    maxAge: '86400', // 24 hours
}

export const cors = koaCors(corsOptions)