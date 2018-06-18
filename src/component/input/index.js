import React, { Component } from 'react'

import { List as AntList, InputItem } from 'antd-mobile'

import style from './index.less'

class App extends Component {
  render () {
    const {
      title,
      rightContent,

      extra,
      children,

      ...rest
    } = this.props

    return (
      <InputItem
        className = { style['item'] }

        extra = { rightContent }

        { ...rest }
      >
        { title }
      </InputItem>
    )
  }
}

const List = props => {
  const {
    ...rest
  } = props

  return (
    <AntList
      className = { style['list'] }

      { ...rest }
    />
  )
}

List.Input = App

export default List