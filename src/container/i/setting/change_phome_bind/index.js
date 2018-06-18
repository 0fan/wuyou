import React, { Component, Fragment } from 'react'
import Image from 'component/image'

import Context from 'context/config'

import Alert from 'component/alert'
import Button from 'component/button'

import List from 'component/input'

const { Input } = List

const GetAuthLimit = 60

class App extends Component {
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
    const { grey } = this.props.contentConfig

    if (grey) {
      this.props.changeContent({
        grey: false
      })
    }
  }

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
      <Fragment>
        <Alert
          message = { this.state.msg }
          type = 'error'
        />
        <List>
          <Input
            value = { this.state.phone }
            onChange = { v => this.handleChange('phone', v) }

            placeholder = '补全手机号'
          />
          <Input
            value = { this.state.auth }
            onChange = { v => this.handleChange('auth', v) }

            placeholder = '输入验证码'
            rightContent = {
              this.state.isAuth ?
                this.state.authIndex + 's' :
                <a href = '#' onClick = { this.getAuthCode }>获取验证码</a>
            }
          />
          <Button htmlType = 'submit' type = 'primary' onClick = { this.handleSubmit }>提交</Button>
        </List>
      </Fragment>
    )
  }
}


export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)