import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'

import { success } from 'model/user'

@connect(state => ({
  user: state.user
}), {
  success
})
export default class App extends Component {
  handleLogin = () => {
    this.props.success({
      nickName: '林凡',
      role: '管理员',
      id: '4544564',
      avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=93438458,2249957451&fm=27&gp=0.jpg'
    })
    store.set('user', {
      nickName: '林凡',
      role: '管理员',
      id: '4544564',
      avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=93438458,2249957451&fm=27&gp=0.jpg'
    })
    this.props.history.push('/')
  }

  render () {
    return (
      <div>
        <h1>login</h1>
        <button onClick = { this.handleLogin }>登录</button>
      </div>
    )
  }
}