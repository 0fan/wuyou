import React, { Component } from 'react'

import Icon from './icon'

import style from './index.less'

class App extends Component {
  render () {
    const {
      rightContent,
      leftContent,

      children,

      ...rest
    } = this.props

    return (
      <div className = { style['header'] } { ...rest }>
        <div className = { style['header-left'] }>{ leftContent }</div>
        <div className = { style['header-center'] }>{ children }</div>
        <div className = { style['header-right'] }>{ rightContent }</div>
      </div>
    )
  }
}

App.Icon = Icon

export default App
