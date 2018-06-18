import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'

import { reset } from 'model/user'

@connect(state => ({
  user: state.user
}), {
  reset
})
export default class App extends Component {
  handleQuit = () => {
    this.props.reset()
    store.remove('user')
  }

  render () {
    return (
      <div>
        <h1>我的房屋</h1>
        <button onClick = { this.handleQuit }>退出</button>
      </div>
    )
  }
}