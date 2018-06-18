import React, { Component, Fragment } from 'react'

import style from './index.less'

export default class App extends Component {
  render () {
    return (
      <Fragment>
        <Logo />
        <Text>
          首开香溪郡为首开地产匠心巨作，全部四至八层墅质洋房产品，园林采用意大利托斯卡纳浪漫主义风格，整体容积率仅1.5, 与周边别墅的容积率基本相当。产品整体规...
        </Text>
      </Fragment>
    )
  }
}

const Logo = props => (
  <div className = { style['logo'] }></div>
)

const Text = props => (
  <div className = { style['text'] }>{ props.children }</div>
)
