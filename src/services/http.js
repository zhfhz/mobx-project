/* eslint-disable */
// @ts-nocheck
import axios from 'axios'
// import { network } from '../config'
import _ from 'lodash'
import appStore from '../pages/app/stores/app'

const baseUrlProd = process.env.REACT_APP_BASE_URL
const baseUrlDev = 'http://api.emake.cn'

const noCatch = func => async (...args) => {
  try {
    return await func(...args)
  } catch (e) {
    return e.response || {
      status: 404,
    }
  }
}
const origin = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? baseUrlDev : baseUrlProd,
})
const instance = {
  ...origin,
  get: noCatch(origin.get),
  post: noCatch(origin.post),
  put: noCatch(origin.put),
  delete: noCatch(origin.delete),
}

let multiAuthResolver
const multiAuthGen = () => new Promise(resolve => multiAuthResolver = resolve)
let multiAuthLock

const _handleUrlParams = (get) => (url, params, config) => {
  if (params) {
    const patched = _.chain(params)
      .entries()
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    if (patched) {
      url = `${url}?${patched}`
    }
  }
  return get(url, config)
}

const _handleResult = (func) => async (...args) => {
  if (multiAuthLock) { // 正在重新获取token
    await multiAuthLock
  }

  /**
   * request
   */
  async function request () {
    try {
      return func(...args)
    } catch (e) {
      return {
        status: 500,
        data: undefined,
      }
    }
  }

  instance.defaults.headers.common['Authorization'] = appStore.accessToken
  let { data, status } = await request()
  let ok, body, info, code
  try {

    if (status === 401) {
      multiAuthLock = multiAuthGen()
      const tokenResp = await instance.get(
        '/access_token',
        { 'refresh_token': appStore.refreshToken },
      )
      if (tokenResp.status !== 200) {
        if (multiAuthResolver) {
          multiAuthResolver(false)
          multiAuthResolver = undefined
        }
        ok = false
        info = '请重新登录'
        code = 403
      } else {
        if (multiAuthResolver) {
          multiAuthResolver(true)
          multiAuthResolver = undefined
        }
        const { Access_token, Refresh_token } = tokenResp.data.Data
        appStore.updateToken(Access_token, Refresh_token)
        const respAgain = await request()
        data = respAgain.data
        status = respAgain
      }
    }

    if (status >= 200 && status < 300) {
      const { Data, ResultInfo, ResultCode } = data || {}
      ok = ResultCode === 0
      info = ResultInfo
      code = ResultCode
      body = Data
    } else {
      ok = false
      if (status === 404) {
        info = '接口不存在'
        // appStore.catchException()
      } else if (status === 403) {
        info = '鉴权失败'
        appStore.logout()
      } else if (status >= 400 && status < 500) {
        info = '参数错误'
      } else if (status >= 500 && status < 600) {
        info = '服务器错误'
        // appStore.catchException()
      } else {
        info = '网络错误'
      }
      code = status
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('未知错误')
    ok = false
    info = '未知错误'
    code = 404
  }
  return {
    Ok: ok,
    Data: body,
    ResultInfo: info,
    ResultCode: code,
  }
}

export const http = {
  get: _handleResult(_handleUrlParams(instance.get)),
  post: _handleResult(instance.post),
  put: _handleResult(instance.put),
}
