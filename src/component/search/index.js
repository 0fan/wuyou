import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      ...rest
    } = this.props

    return (
      <div className = { style.search }>
        <SearchBar { ...rest } />
      </div>
    )
  }
}