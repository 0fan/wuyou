import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import store from 'store'
import cs from 'classnames'

import { Toast, Modal } from 'antd-mobile'
import Layout from 'component/layout'
import Image from 'component/image'
import Button from 'component/button'
import Alert from 'component/alert'

import { url, api } from 'config/api'

import { login } from 'model/user'

import List from 'component/input'

import style from './index.less'

const { alert } = Modal
const { Input } = List
const { Content } = Layout

const { server } = url
const { sendCode, loginByPhone } = api

@connect(state => ({
  user: state.user
}), {
  login
})
export default class App extends Component {
  constructor (props) {
    super(props)

    const phone = store.get('phone')

    if (!phone) {
      window.location.href = 'http://appgy.gyfc.net.cn/UserCenter/Center/LoginPage'
    }

    this.login(phone)
  }

  login = async (phone) => {
    Toast.loading('登录中...', 0, null, true)

    const [err, res] = await axios.post(server + loginByPhone, {
      phone
    })

    Toast.hide()

    if (err) {
      alert('提示', err, [{
        text: '跳转到首页',
        onPress: () => this.props.history.push('/')
      }, {
        text: '重新登录',
        onPress: () => this.login(phone)
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

    this.props.login(data)
    // 注册axios header
    axios.defaults.headers.common['token'] = data.token
    store.set('user', data)

    Toast.success('登录成功', 3, () => {
      this.props.history.push('/')
    }, false)

    return [null, res]
  }

  render () {
    return null
  }
}