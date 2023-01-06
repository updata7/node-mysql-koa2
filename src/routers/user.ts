/*
 * @Author: CKJiang 
 * @Date: 2022-08-13 10:08:12 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-24 01:22:41
 */

import Joi from 'joi'
import userHandler from '../handlers/userHandler'
import { mongoIdSchema, cudResultSchema, pagingSchema } from './schema'
export default [
    {
        meta: {
            swagger: {
                summary: 'new record',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/create',
        method: 'POST',
        validate: {
            body: Joi.object({
                name: Joi.string().trim().required().description('user name'),
                address: Joi.string().trim().required().description('user address'),
                description: Joi.string().trim().required().description('user description')
            }),
            output: {
                success: Joi.boolean().required().description('是否成功').example(true),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.create
    },
    {
        meta: {
            swagger: {
                summary: 'get user record',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/search',
        method: 'GET',
        // auth: true,
        validate: {
            query: Joi.object({
                name: Joi.string().trim().description('user name'),
            }).keys(pagingSchema.request),
            output: {
                rows: Joi.array().description('list'),
                count: Joi.number().description('total count')
            }
        },
        handler: userHandler.search
    },
    {
        meta: {
            swagger: {
                summary: 'update data',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/update',
        method: 'POST',
        validate: {
            body: Joi.object({
                id: Joi.number().required().description("user id"),
                name: Joi.string().trim().required().description('user name'),
                address: Joi.string().trim().required().description('user address'),
                description: Joi.string().trim().required().description('user description')
            }),
            output: {
                success: Joi.boolean().required().description('if success').example(true),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.update
    },
    {
        meta: {
            swagger: {
                summary: '删除数据 delete',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/delete',
        method: 'PUT',
        validate: {
            body: Joi.object({
                ids: Joi.array().required().description("id 数组"),
            }),
            output: {
                success: Joi.boolean().required().description('是否成功').example(true),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.delete
    },
]