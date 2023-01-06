/*
 * @Author: CKJiang 
 * @Date: 2022-08-12 11:00:58 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-23 16:21:11
 */

import path from 'path'
import nconf from 'nconf'

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

function initConfigs () {
  nconf.use('memory')
  if (isProduction) {
    nconf.file(path.resolve(__dirname, 'production.json'))
  } else {
    nconf.file(path.resolve(__dirname, 'development.json'))
  }
}

initConfigs()

export default nconf
