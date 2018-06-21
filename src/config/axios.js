import axios from 'axios'
import qs from 'qs'

import getHttpStatusText from '../util/getHttpStatusText'

import { Modal } from 'antd-mobile'
import { logout } from 'model/user'

const { alert } = Modal

export default (store) => {
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
      // 等于-2说明登录失败需要重新登录,这里需要触发退出事件
      if (code ===  -2) {
        alert('登录凭证失效', message ? message : '', [{
          text: '进入新盘页面',
          onPress: () => {
            store.dispatch(logout(() => {
              window.location = window.location.origin + '/#/new_building'
            }))
          }
        }, {
          text: '重新登录',
          onPress: () => {
            store.dispatch(logout(() => {
              window.location = window.location.origin + '/#/login'
            }))
          }
        }])
      }

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
}
