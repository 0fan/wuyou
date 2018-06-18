import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import cs from 'classnames'
import { Link } from 'react-router-dom'

import style from './index.less'

@withRouter
export default class App extends Component {
  render () {
    const {
      location: {
        pathname
      },
      tabs = tabs,
      children,

      ...rest
    } = this.props

    return (
      <div className = { style['tabs-wrap'] }>
        {
          tabs.map((v, i) => (
            <Item
              { ...v }
              pathname = { pathname }

              key = { i }
            />
          ))
        }
      </div>
    )
  }
}

const Item = props => {
  const {
    pathname,
    active,
    to,
    title
  } = props

  const regex = new RegExp('^' + to + '(:|/|$)', 'i')

  if (to) {
    return (
      <Link
        className = { cs(style['tabs'], { [style['tabs-active']]: active || regex.test(pathname) }) }
        to = { to }
      >
        { title }
      </Link>
    )
  }

  return (
    <div
      className = { cs(style['tabs'], { [style['tabs-active']]: active || regex.test(pathname) }) }
    >
      { title }
    </div>
  )
}
