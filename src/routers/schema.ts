import Joi from 'joi'
const timeSchema = Joi.string().trim().isoDate().description('时间').example('2022-03-11T04:18:06.121Z')
const mongoIdSchema = Joi.string().trim().regex(/^([a-z0-9]{24})$/).example('5bae21a710b42d201c25d7b0')

const optionalSchemas = {
    id: Joi.string().example('5cc178841fad7cee845993d0').description('ID'),
    string: Joi.string().example('string').description('字符串'),
    number: Joi.number().example(0).description('数值'),
    boolean: Joi.boolean(),
    dateTime: Joi.date().example('2022-01-01T00:00:00.000Z').description('日期时间'),
    sortField: Joi.string().example('id').description('排序字段'),
    page: Joi.number().example(1).default(1).min(1).max(300).description('第几页, 从1开始'),
    limit: Joi.number().example(10).default(10).min(1).max(50).description('返回条目数限制')
}

const cudResultSchema = Joi.object({
    success: Joi.boolean().required().description('是否成功').example(true),
    message: Joi.string().when('success', {
        is: false,
        then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
        otherwise: Joi.optional()
    })
}).unknown()

const pagingSchema = {
    request: {
        // 这里使用了default默认值，不要添加required desc 降序
        pageNo: Joi.number().integer().min(1).default(1).description('第几页').example(1),
        pageSize: Joi.number().integer().min(1).default(10).description('一页多少条记录').example(20),
        sortField: Joi.string().default('createdAt').description('排序').example('createdAt'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc').description('排序顺序').example('desc'),
        isLoadAll: Joi.boolean().default(false).description('是否获取全部数据')
    },
    response: {
        paging: {
            count: Joi.number().integer().min(0).optional().description('符合条件的记录数').example(99),
            rows: Joi.array().optional().description('记录列表').example([])
        }
    }
}

const cudTimeSchema = {
    createdAt: timeSchema.description('创建时间'),
    updatedAt: timeSchema.description('最新修改时间')
}

export {
    timeSchema,
    mongoIdSchema,
    optionalSchemas,
    cudResultSchema,
    pagingSchema,
    cudTimeSchema
}