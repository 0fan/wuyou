import React, { Component } from 'react'
import axios from 'axios'
import store from 'store'
import { connect } from 'react-redux'

import { Toast, Modal } from 'antd-mobile'
import getUrlParam from 'util/getUrlParam'

import { success } from 'model/user'

import { url, api } from 'config/api'

const { alert } = Modal
const { server } = url
const { getWechatCode, login } = api


// 此页面的情况
// 未登录: url无code, 此时将跳转到登录页面等待重定向返回code
// 有code, 根据code调用服务器登录接口
// 为防止死循环,用store做一个跳转的记录

@connect(state => ({
  user: state.user
}), {
  success
})
export default class App extends Component {
  constructor (props) {
    super(props)

    const code = getUrlParam('code')

    if (!code) {
      Toast.loading('跳往微信授权中...', 0, null, true)

      this.jumpWechatAuth()
    } else {
      this.login({ code })
    }
  }

  componentWillUnmount () {
    // Toast.hide()
  }

  // 跳转微信授权页面
  jumpWechatAuth = () => {
    window.location = server + getWechatCode + '?backUrl=' + window.location.origin + '/#/login'
  }

  login = async (params) => {
    Toast.loading('登录中...', 0, null, true)

    const [err, res] = await axios.get(server + login, {
      params
    })

    Toast.hide()

    if (err) {
      alert('提示', err, [{
        text: '跳转到首页',
        onPress: () => this.props.history.push('/')
      }, {
        text: '重新授权',
        onPress: () => this.jumpWechatAuth()
      }])

      return [err]
    }

    const data = {
      token: res.object.token,
      id: res.object.userInfo.id,
      // 微信id
      wechatId: res.object.userInfo.wechatId,
      // 用户类型
      userType: res.object.userInfo.userType,
      // 用户等级
      userLevel: res.object.userLevel,
      // 身份证号码
      idCardNo: res.object.userInfo.idCardNo,
      // 性别
      // 1 男
      // 2 女
      // 0 未知
      sex: res.object.userInfo.sex,
      // 手机号码
      phone: res.object.userInfo.phone,
      // 姓名
      name: res.object.userInfo.name,
      // 昵称
      nickName: res.object.userInfo.nickName,
      // 头像图片
      headPhoto: res.object.userInfo.headPhoto,
    }

    // 注册redux
    this.props.success(data)
    // 注册axios header
    axios.defaults.headers.common['token'] = data.token
    // 保存数据在缓存里 刷新不用重新登录
    store.set('user', data)

    Toast.success('登录成功', 1, () => {
      this.props.history.push('/')
    }, false)
  }

  render () {
    return null
  }
}