import { Context, Next } from "koa"

export { cors } from "./cors"

export async function logRequest(ctx: Context, next: Next) {
    const start = Date.now()
    await next()
    const timeUsed = Date.now() - start
    if (ctx.status !== 200) {
        console.info(`${ctx.method} ${ctx.status} ${ctx.url} ${timeUsed}ms`)
    }
}

export async function setResponseHeader (ctx: Context, next: Next) {
    await next()
    ctx.response.set('Access-Control-Allow-Origin', '*')
}

export async function handleExceptionStatus (ctx: Context, next: Next) {
    try {
        await next()
    } catch (err: any) {
        let { name, status, code, message, captureOptions }: {
            name: String, status: number, code: number, message: String,
            captureOptions: String
        } = err
        console.debug(err)
        if (name === 'AssertError') {
            console.error('error', err)
            ctx.status = status
        } else if (name === 'MongoError') {
            ctx.status = 500
            code = 500
            const { errmsg, code: mongoCode } = err
            const captureOptions = { errmsg, mongoCode }
            console.error(message, { ...err, captureOptions })
        } else if (name === 'ValidationError') {
            ctx.status = 400
            delete err.stack
            console.warn('请求参数验证错误', err)
        } else if (name === 'ForbiddenError') {
            ctx.status = 403
            console.warn('权限验证错误', message)
        } else {
            ctx.status = status || 500
        }
    
        ctx.body = {
            status: ctx.status,
            code: code,
            message,
            options: captureOptions
        }
    }
  }
  