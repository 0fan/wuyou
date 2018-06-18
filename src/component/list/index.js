import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { List as AntList } from 'antd-mobile'

import style from './index.less'

@withRouter
class App extends Component {
  static defaultProps = {
    onClick: f => f
  }

  handleClick = () => {
    const {
      onClick,
      to,
      history
    } = this.props

    if (to) {
      history.push(to)
    }

    onClick()
  }

  render () {
    const {
      title,
      rightContent,
      leftContent,
      thumb,

      extra,
      children,
      to,
      arrow,

      // omit
      onClick,
      staticContext,
      location,
      match,
      history,

      ...rest
    } = this.props

    return (
      <AntList.Item
        className = { style['item'] }

        extra = { rightContent }
        thumb = { leftContent }
        onClick = { this.handleClick }
        arrow = { to ? 'horizontal' : arrow }

        { ...rest }
      >
        { title }
      </AntList.Item>
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

List.Item = App

export default List