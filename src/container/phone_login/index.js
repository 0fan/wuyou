import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import store from 'store'
import cs from 'classnames'

import { Toast } from 'antd-mobile'
import Layout from 'component/layout'
import Image from 'component/image'
import Button from 'component/button'
import Alert from 'component/alert'

import { url, api } from 'config/api'

import { login, updatePhone } from 'model/user'

import List from 'component/input'

import style from './index.less'

const { Input } = List
const { Content } = Layout

const { server } = url
const { sendCode, loginByPhone } = api

const GetAuthLimit = 60

@connect(state => ({
  user: state.user
}), {
  login,
  updatePhone
})
export default class App extends Component {
  isMount = true
  authTimer = null

  state = {
    phone: '',
    auth: '',

    msg: '',

    isAuth: false,
    authIndex: GetAuthLimit,

    isGetAuth: false
  }

  componentDidMount () {
    // 只有绑定之后才能进入此页面
    // if (!this.props.user.auth) {
    //   this.props.history.push('/')
    // }
  }

  componentWillUnmount () {
    this.isMount = false

    this.clear()
  }

  sendCode = async () => {
    Toast.loading('发送验证码...', 0, null, true)

    const [err, res] = await axios.post(server + sendCode, {
      mobile: this.state.phone
    })

    Toast.hide()

    if (err) {
      Toast.fail(err, 3, null, false)

      return [err]
    }

    Toast.success('验证发送成功', 3, null, false)

    return [null, res]
  }

  login = async () => {
    Toast.loading('绑定中...', 0, null, true)

    const [err, res] = await axios.post(server + loginByPhone, {
      phone: this.state.phone,
      smsCode: this.state.auth
    })

    Toast.hide()

    if (err) {
      Toast.fail(err, 3, null, false)

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

    this.props.login(data)
    // 注册axios header
    axios.defaults.headers.common['token'] = data.token
    store.set('user', data)

    Toast.success('绑定成功', 3, () => {
      this.props.history.push('/')
    }, false)

    return [null, res]
  }

  clear = () => {
    clearInterval(this.authTimer)
    this.authTimer = null
  }

  getAuthCode = async e => {
    e.preventDefault()

    if (this.state.isAuth) {
      return
    }

    if (!this.valid('phone')) {
      return
    }

    const [err, res] = await this.sendCode()

    if (err) {
      return
    }

    this.setState({
      isGetAuth: true,

      isAuth: true,
      authIndex: GetAuthLimit
    })

    this.authTimer = setInterval(() => {
      if (this.state.authIndex - 1 < 0) {
        if (this.isMount) {
          this.setState({
            isAuth: false
          })
        }

        this.clear()

        return
      }

      if (this.isMount) {
        this.setState({
          authIndex: this.state.authIndex - 1
        })
      }
    }, 1000)
  }

  valid = (type) => {
    const {
      phone,
      auth
    } = this.state

    let msg = ''
    let error = {
      phone: [],
      auth: [],
    }

    if (!phone.length) {
      msg = '请输入手机号码'
      error.phone.push(msg)
    }

    if (!auth.length) {
      msg = '请输入验证码'
      error.auth.push(msg)
    }


    if (type) {
      if (error[type].length) {
        this.setState({ msg: error[type][0] })
      } else {
        this.setState({ msg: '' })
      }

      return error[type].length === 0
    }

    this.setState({ msg })

    return msg ? false : true
  }

  handleChange = (type, v) => {
    this.setState({
      [type]: v
    })
  }

  handleSubmit = async () => {
    if (this.valid()) {
      const [err, res] = await this.login()
    }
  }

  render () {
    return (
      <Layout fixed>
        <Content>
          <Logo src = { require('asset/img/logo.png') } />
          <List>
            <Input
              value = { this.state.phone }
              onChange = { v => this.handleChange('phone', v) }

              placeholder = '手机号'
              title = { <Icon type = 'phone' /> }
            />
            <Input
              value = { this.state.auth }
              onChange = { v => this.handleChange('auth', v) }

              placeholder = '输入验证码'
              title = { <Icon type = 'auth' /> }
              rightContent = {
                this.state.isAuth ?
                  this.state.authIndex + 's' :
                  <a href = '#' onClick = { this.getAuthCode }>获取验证码</a>
              }
            />
            <Button htmlType = 'submit' type = 'primary' onClick = { this.handleSubmit } style = { { marginBottom: 20 } }>绑定</Button>
          </List>
          <Alert
            message = { this.state.msg }
            type = 'error'
            fixed
          />
        </Content>
      </Layout>
    )
  }
}

const Icon = props => (
  <div className = { cs(style['icon'], style[`icon-${ props.type }`]) }></div>
)

const Logo = props => (
  <div className = { style.logo }>
    <Image src = { props.src } height = { 90 } />
  </div>
)

function getErrorList (error) {
  let errorList = []

  Object.keys(error).map(key => {
    if (error[key] && error[key].length) {
      errorList = errorList.concat(error[key])
    }
  })

  return errorList
}