/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 16:48:44 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-24 01:22:56
 */

// import userEngine from "engines/channelEngine"
import { assert, CODES, HTTP_STATUS } from "../utils/error"
import { genToken, verifyToken } from "../utils/tools"
import { Context } from "koa";
import userEngine from "../engines/userEngine";
import { User } from '../models/userModel'
import { CreationAttributes, Op } from 'sequelize'
import { WhereOptions } from 'sequelize/types';

interface SearchBody extends BaseSearchBody {
    name: string;
}

class UserHandler {
    // token 校验 暂没有
    async authVerifyToken(token: any): Promise<any> {
        let user_data
        try {
            const { id, account }: {
                id: string, account: string
            } = verifyToken(token)
            assert(!(id && account), HTTP_STATUS.InternalServerError, CODES.INTERNAL_SERVER_ERROR, "无效token")
            // user_data = await userEngine.findOne({ _id: id })
            // return {
            //     id: user_data.id,
            //     account: user_data.account,
            // }
        } catch (err: any) {
            assert(err.name === 'JsonWebTokenError', HTTP_STATUS.Unauthorized, CODES.TOKEN_INVALID, '检验失败')
            assert(err.name === 'TokenExpiredError', HTTP_STATUS.Unauthorized, CODES.TOKEN_EXPIRED, 'token已过期')
            throw err
        }
    }

    // 新建
    async create(ctx: Context) {
        const user: CreationAttributes<User> = ctx.request.body
        // console.debug('userHandler create req ==> ', name, 
        //     address, description)
        const res = await userEngine.create(user)

        ctx.body = { success: true }
    }

    // 获取列表
    async search(ctx: Context) {
        const query: SearchBody = ctx.request.query as any

        const where: WhereOptions = {}
        if (query.name) {
            where['name'] = {
                [Op.like]: `%${query.name}%`,
            }
        }

        const options: any = Object.create({
            order: [
                [
                    `${query.sortField}`, `${query.sortOrder}`
                ]
            ]
        })
        if (query.isLoadAll) {

        } else {
            options.limit = query.pageSize
            options.offset = ( query.pageNo - 1 ) * query.pageSize
        }
        console.debug('userHandler search res ==> ', query.name, where)
        const res = await userEngine.search(where, options)
        ctx.body = res
    }

    // 删除
    async delete(ctx: Context) {
        // console.debug('userHandler delete ==> ', ctx.request)
        const { ids } = ctx.request.body
        console.log('user delete ==> ', ids)
        await userEngine.delete(ids)
        ctx.body = { success: true }
    }

    // 更新
    async update(ctx: Context) {
        const { id, name, address, description } = ctx.request.body
        await userEngine.updateById(id, { name, address, description })
        ctx.body = { success: true }
    }
}

export default new UserHandler();