import axios from 'axios'
import qs from 'qs'

import getHttpStatusText from '../util/getHttpStatusText'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(cfg => {

  if (cfg.method === 'post') {
    cfg.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    cfg.data = qs.stringify(cfg.data)
  }

  return cfg

}, err => [err.toString()])

axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    return [`连接失败 code:${ res.status }`]
  }

  const { code, message, object } = res.data

  if (code !== 0) {
    // 有可能没有message
    return [message || '请求错误']
  }

  return [null, res.data]
}, err => {
  const { error, config, code, request, response } = err

  if (!response) {
    return ['未连接到服务器']
  }

  // 还是需要返回错误原信息,因为接口需要传递发送信息与接口的信息
  if (response.status) {
    return [getHttpStatusText(response.status), err]
  }

  return ['连接失败', err]
})
