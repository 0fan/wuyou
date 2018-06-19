import React, { Component } from 'react'
import { connect } from 'react-redux'

import List from 'component/list'

const { Item } = List

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  render () {
    return (
      <List>
        <Item title = '用户ID' rightContent = { this.props.user.id } />
        <Item title = '手机换绑' to = '/i/setting/change_phome_bind' />
      </List>
    )
  }
}