import React, { Component } from 'react'
import cs from 'classnames'

import Layout from 'component/layout'
import Image from 'component/image'
import Button from 'component/button'
import Alert from 'component/alert'

import List from 'component/input'

import style from './index.less'

const { Input } = List
const { Content } = Layout

const GetAuthLimit = 60

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

  // componentDidMount () {
  //   this.props.form.validateFields()
  // }

  componentWillUnmount () {
    this.isMount = false

    this.clear()
  }

  clear = () => {
    clearInterval(this.authTimer)
    this.authTimer = null
  }

  getAuthCode = e => {
    e.preventDefault()

    if (this.state.isAuth) {
      return
    }

    if (!this.valid('phone')) {
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

  handleSubmit = () => {
    if (this.valid()) {
      console.log(this.valid())
    }
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
            <Button htmlType = 'submit' type = 'primary' onClick = { this.handleSubmit }>登录</Button>
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