import React, { Component } from 'react'

import Item from './item'

import style from './index.less'

class App extends Component {
  render () {
    const {
      children,

      ...rest
    } = this.props

    return (
      <div className = { style['list'] }>{ children }</div>
    )
  }
}

App.Item = Item

export default App
