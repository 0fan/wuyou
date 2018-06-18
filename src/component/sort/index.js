import React, { Component } from 'react'
import cs from 'classnames'

import style from './index.less'

export default class App extends Component {
  render () {
    return (
      <div className = { style['sort'] }>
        <div className = { cs(style['sort-item'], style['sort-item-active']) }>观山湖区</div>
        <div className = { style['sort-item'] }>物业类型</div>
        <div className = { style['sort-item'] }>价格区间</div>
        <div className = { style['sort-item'] }>不限户型</div>
      </div>
    )
  }
}