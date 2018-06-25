import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { Badge } from 'antd-mobile'

import regex from 'path-to-regexp'
import cs from 'classnames'

import style from './index.less'

@withRouter
export default class App extends Component {
  handleClick = (e, to) => {
    e.preventDefault()

    const { pathname } = this.props.location

    // 不重复跳转
    if (pathname !== to) {
      this.props.history.push(to)
    }
  }

  render () {
    const {
      text,
      badge,
      type,
      children,
      to,
      active,
      location: {
        pathname
      },

      ...rest
    } = this.props

    /* eslint no-useless-escape: 0 */
    const regex = new RegExp('^' + to + '(:|/|$)', 'i')

    return (
      <Link
        className = {
          cs(style['footer-menu'], {
            [style[`footer-menu-${ type }`]]: type,
            [style['footer-menu-active']]: active || regex.test(pathname),
          })
        }

        onClick = { e => this.handleClick(e, to) }

        to = { to }
      >
        <div className = { style['footer-menu-text'] }>
          {
            badge ? <Badge text = { badge } /> : null
          }
          { text }
        </div>
      </Link>
    )
  }
}
