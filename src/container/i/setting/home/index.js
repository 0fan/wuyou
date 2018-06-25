import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import List from 'component/list'

import { logout } from 'model/user'

import style from './index.less'

const { Item } = List

@connect(state => ({
  user: state.user
}), {
  logout
})
export default class App extends Component {
  handleLogout = () => {
    this.props.logout(() => {
      this.props.history.push('/')
    })
  }

  render () {
    return (
      <Fragment>
        <List>
          <Item title = '用户ID' rightContent = { this.props.user.id } />
          <Item title = '手机换绑' to = '/i/setting/change_phome_bind' />
        </List>
        <div className = { style['quit'] } onClick = { this.handleLogout }>退出</div>
      </Fragment>
    )
  }
}