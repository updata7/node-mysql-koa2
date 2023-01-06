import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import Config from '../config'
/**
 * 获取制定目录下的绝对路径
 * @param {文件夹} directorys 
 * @param {后缀} suffix 
 * @returns 
 */
export function getAllFilePaths(directorys: Array<string>, suffix = ".js"): Array<string> {
    const filePaths: Array<string> = []
    directorys.forEach(curDir => {
        const names = fs.readdirSync(curDir)
        // console.debug("getAllFilePaths ==> ", curDir, names)
        names.forEach(name => {
            const absolutePath: any = path.resolve(curDir, name)
            if (name.endsWith(suffix)) {
                filePaths.push(path.resolve(curDir, name))
            } else if (fs.statSync(absolutePath).isDirectory()) {
                const subFilePaths = getAllFilePaths(absolutePath)
                filePaths.push(...subFilePaths)
            }
        })
    })
    return filePaths
}

/**
 * 
 * @param {密码明文} password 
 * @param {密钥} salt 
 * @returns 
 */
export function getSaltedPassword(password: String, salt: String) {
    return md5(`${password} + ${salt}`)
}

/**
 * 生产token
 * @param {用户数据, id, account} options
 */
export function genToken(options: any) {
    const vCode = md5(Object.values(options).join(':'))
    const tokenObj = { 
        ...options,
        vCode
    }
    const { secretKey, expiresIn, algorithm } = Config.get('jwt')
    const token = jwt.sign(tokenObj, secretKey, { expiresIn, algorithm })
    return token
}

/**
 * 验证token并返回生成token时的options
 * @param {*} token 
 */
export function verifyToken(token: string): any {
    const { secretKey, expiresIn, algorithm }: {
        secretKey: jwt.Secret, expiresIn: any, algorithm: any
    } = Config.get('jwt')
    const tokenObj = jwt.verify(token, secretKey, { algorithms: algorithm })
    return tokenObj
}

export function removeUndefinedKey(obj: any): any {
    if (obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'undefined' || obj[key] === null) {
                delete obj[key]
            }
        })
    }
    return obj
}