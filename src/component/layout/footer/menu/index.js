import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import regex from 'path-to-regexp'
import cs from 'classnames'

import style from './index.less'

@withRouter
export default class App extends Component {
  render () {
    const {
      text,
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

        to = { to }
      >
        <div className = { style['footer-menu-text'] }>{ text }</div>
      </Link>
    )
  }
}
