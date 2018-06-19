import React, { Component } from 'react'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      children,

      ...rest
    } = this.props

    return (
      <div className = { style[''] }>结果</div>
    )
  }
}