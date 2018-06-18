import React, { Component } from 'react'

import Menu from './menu'

import style from './index.less'

class App extends Component {
  render () {
    const {
      children,

      ...rest
    } = this.props

    return (
      <div className = { style['footer'] } { ...rest }>{ children }</div>
    )
  }
}

App.Menu = Menu

export default App
