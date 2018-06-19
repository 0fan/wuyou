import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import cs from 'classnames'

import { Toast } from 'antd-mobile'
import Layout from 'component/layout'
import Image from 'component/image'
import Button from 'component/button'
import Alert from 'component/alert'

import { url, api } from 'config/api'

import { logout, updatePhone } from 'model/user'

import List from 'component/input'

import style from './index.less'

const { Input } = List
const { Content } = Layout

const { server } = url
const { sendCode, bindPhone } = api

const GetAuthLimit = 60

@connect(state => ({
  user: state.user
}), {
  logout,
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
    // 只有登录之后才能进入此页面
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

  bindPhone = async () => {
    Toast.loading('绑定手机号中...', 0, null, true)

    const [err, res] = await axios.post(server + bindPhone, {
      phone: this.state.phone,
      smsCode: this.state.auth,
      userId: this.props.user.id,
    })

    Toast.hide()

    if (err) {
      Toast.fail(err, 3, null, false)

      return [err]
    }

    Toast.success('绑定手机号发送成功', 3, null, false)
    this.props.updatePhone(this.state.phone)

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
      const [err, res] = await this.bindPhone()
    }
  }

  handleLogout = () => {
    this.props.logout()
    this.props.history.push('/')
  }

  render () {
    return (
      <Layout fixed>
        <Content>
          <Logo />
          <List>
            <Input
              value = { this.state.phone }
              onChange = { v => this.handleChange('phone', v) }

              placeholder = '补全手机号'
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
            <Button htmlType = 'submit' type = 'primary' onClick = { this.handleSubmit } style = { { marginBottom: 20 } }>绑定手机号</Button>
            <Button onClick = { this.handleLogout }>退出登录</Button>
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