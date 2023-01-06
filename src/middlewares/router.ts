/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 16:24:28 
 * @Last Modified by:   CkJiang 
 * @Last Modified time: 2022-08-23 16:24:28 
 */

import path from 'path';
import { getAllFilePaths } from '../utils/tools'
import router from 'koa-joi-router'
import Config from '../config'
import { RouterPath } from './routerPath';
const Joi = router.Joi

function adjustHeaderField (routes: Array<any>) {
    routes.forEach(route => {
        if (route.auth) {
            route.validate.header = Joi.object({
                ...route.validate.header,
                'access-token': Joi.string().description('授权字符串')
            }).unknown()
        }
    })
}
/**
 * 
 * @param {
 *  directories: Array 目录数组,路由所有在文件夹
 *  excludePaths: Array 文件夹下非路由文件或不需要生成路由的文件
 * } options 
 */
export function getAllRouters(routerPath: RouterPath) {
    // let { directories, excludePaths } = routerPath
    let directories = routerPath.directories
    let excludePaths = routerPath.excludePaths
    let paths = getAllFilePaths(directories)
    excludePaths = excludePaths.map((relativePath: string) => path.resolve(directories[0], relativePath))
    paths = paths.filter((item: any) => !excludePaths.includes(item))

    let routes: Array<any> = []
    let fileNameToRoute = new Map();
    paths.forEach((item: string) => {
        // console.debug("getAllRouters ==> ", item)
        let route = require(item).default
        if (Array.isArray(route)) {
            route.forEach((i) => { 
                if (fileNameToRoute.get(i.path)) {
                    throw new Error(`路由重复配置：${i.path}`)
                }
                fileNameToRoute.set(i.path, path.parse(item).name)
             })
            routes.push(...route)
        } else {
            routes.push(route)
        }
    })

    // console.debug("getAllRouters ====>> ", paths, directories, excludePaths)
    routes.forEach(route => {
        // console.info("path =>>> ", route.path)
        route.validate.output = {
            200: {
                schema: '请求返回成功',
                body: route.validate.output     // 返回的数据,这里可以做统一的加密
            },
            400: {
                schema: '字段校验错误',
                body: {
                    status: 400,
                    code: Joi.number().integer().positive().description('错误码').example(400002),
                    message: Joi.string().required().description('error message in english'),
                    options: Joi.object().description('数据库错误信息')
                }
            },
            401: {
                schema: '未授权或缺少授权字段',
                body: {
                    status: 400,
                    code: Joi.number().integer().positive().description('错误码').example(400003),
                    message: Joi.string().required().description('未授权'),
                    options: Joi.object().description('数据库错误信息')
                }
            },
            500: {
                schema: '系统错误',
                body: {
                    status: 400,
                    code: Joi.number().integer().positive().description('错误码').example(400004),
                    message: Joi.string().required().description('系统错误'),
                    options: Joi.object().description('数据库错误信息')
                }
            }
        }
    
        if (route.method.match(/PUT|POST/i)) {
            route.validate.type = route.validate.type || 'json'
        } else if (route.method.match(/DELETE/i)) {
            route.validate.type = route.validate.type || 'x-www-form-urlencoded'
        }
    })

    adjustHeaderField(routes)
    const joiRouter = router()
    joiRouter.prefix(Config.get("apiPrefix"))

    joiRouter.route(routes)
    return { routers: joiRouter }
}