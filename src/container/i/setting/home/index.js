import React, { Component } from 'react'

import List from 'component/list'

const { Item } = List

export default class App extends Component {
  render () {
    return (
      <List>
        <Item title = '用户ID' rightContent = '100010' />
        <Item title = '手机换绑' to = '/i/setting/change_phome_bind' />
      </List>
    )
  }
}