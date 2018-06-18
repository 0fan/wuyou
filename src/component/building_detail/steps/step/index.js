import React, { Component } from 'react'
import cs from 'classnames'

import style from './index.less'

class App extends Component {
  render () {
    const {
      type,
      text,
      current,
      active,
      children,

      ...rest
    } = this.props

    return (
      <div
        className = { cs(style['step-wrap'], {
          [style['step-wrap-active']]: active,
          [style[`step-wrap-${ type }`]]: type,
          [style['step-wrap-current']]: current
        }) }
      >
        <div
          className = { style['step'] }
        >
          <div className = { style['step-text'] }>
            { text }
          </div>
        </div>
        <div className = { style['step-wrap-text'] }>{ text }</div>
      </div>
    )
  }
}

const Spacer = props => <div className = { style['step-spacer'] }></div>

App.Spacer = Spacer

export default App
