/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 16:04:06 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-24 17:35:34
 */

import Koa from 'koa'
import path from 'path'
import Config from './config'
import sequelize from './models'
import { getAuthentication } from './middlewares/authentication'
import { getAllRouters } from './middlewares/router'
import { handleExceptionStatus, setResponseHeader, cors } from './middlewares'
import { RouterPath } from './middlewares/routerPath'
const getSwagger = require('./swagger')

// 添加中间组件
function addMiddlewares(app: Koa) {
    const middlewares = [cors, setResponseHeader, handleExceptionStatus]
    const routerPath: RouterPath = new RouterPath([path.join('dist/src/routers')], ["test.js", "schema.js"])
    const { routers } = getAllRouters(routerPath)
    const authorization = getAuthentication(routers)
    middlewares.push(authorization)
    middlewares.push(routers.middleware())
    middlewares.forEach(item => app.use(item))
    const { swaggerRouter, swaggerUI } = getSwagger(routers)
    app.use(swaggerRouter.middleware())
    app.use(swaggerUI)
}

function addEventListener (app: Koa) {
    app.on('error', err => {
        console.error('APP未知错误', err)
        process.exit(1)
    })
    process.on('uncaughtException', err => {
        console.error('uncaughtException(有一个未捕获的错误)', err)
        process.exit(1)
    })
    process.on('unhandledRejection', err => {
        console.error('unhandledRejection', err)
        // process.exit(1)
    })

    process.on('SIGINT', async function () {
        console.info('main process get SIGINT sign')
        await sequelize.close()
        process.exit(0)
    })

    process.on('beforeExit', (code) => {
        console.warn('beforeExit event with code: ', code);
    });
      
  
    process.on('SIGTERM', async () => {
        console.warn('main process get SIGTERM sign')
        await sequelize.close()
        process.exit(0)
    })
  
    process.on('exit', () => {
        console.warn('main process get exit sign')
    })
}

async function connectDb() {
    try {
        await sequelize.sync({ force: false })
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export function start() {
    const app = new Koa()
    addMiddlewares(app)
    addEventListener(app)
    connectDb()

    const port = Config.get('port')
    const server = app.listen(port, () => {
        console.info(`
            Server is running!
            Local:   http://localhost:${port}
            Api Docs:   http://localhost:${port}/api/docs
        `)
    })
}