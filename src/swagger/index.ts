/*
 * @Author: CKJiang 
 * @Date: 2022-08-12 13:31:39 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-13 09:33:58
 */
import { Context } from 'koa'
import { koaSwagger } from 'koa2-swagger-ui'
import { SwaggerAPI } from 'koa-joi-router-docs'
import koaRouter from 'koa-joi-router'
import { name, version } from '../../package.json'
const Joi = koaRouter.Joi

function getSwagger(routers: koaRouter.Router) {
    let swagger = new SwaggerAPI()
    swagger.addJoiRouter(routers)

    const spec = swagger.generateSpec(
        {
            info: {
                title: name,
                description: `API document of ${name}`,
                version: version
            },
            basePath: '/',
            tags: [],
            // securityDefinitions: {
            //     token: {
            //         type: 'apiKey',
            //         name: 'Authorization',
            //         in: 'header'
            //     }
            // }
        },
        {
            defaultResponses: {
                200: {
                    code: 200,
                    data: {}
                }
            }
        }
    )

    
    /**
     * Swagger JSON API
     */
    let swaggerRouter = koaRouter()

    swaggerRouter.route({
        path: '/api/swagger.json',
        method: 'get',
        handler: (ctx: Context) => {
          ctx.body = JSON.stringify(spec, null, '  ')
        }
    })

    const swaggerUI = koaSwagger({
        routePrefix: '/api/docs', // host at /swagger instead of default /docs
        swaggerOptions: {
            url: '/api/swagger.json',
        },
    })

    return { swaggerRouter, swaggerUI }
}

module.exports = getSwagger
