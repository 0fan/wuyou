import React, { Component } from 'react'

import { Tabs } from 'antd-mobile'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      swipeable = false,

      ...rest
    } = this.props

    return (
      <div className = { style['tabs'] }>
        <Tabs
          swipeable = { swipeable }

          { ...rest }
        />
      </div>
    )
  }
}