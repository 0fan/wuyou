import React, { Component } from 'react'
import cs from 'classnames'

import { SearchBar } from 'antd-mobile'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      topBorder,
      bottomBorder,

      ...rest
    } = this.props

    return (
      <div className = { cs(style.search, {
        [style['search-top-border']]: topBorder,
        [style['search-bottom-border']]: bottomBorder
      }) }>
        <SearchBar { ...rest } />
      </div>
    )
  }
}