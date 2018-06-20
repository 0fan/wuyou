import React, { Component } from 'react'
import cs from 'classnames'

import Menu from './menu'

import style from './index.less'

class App extends Component {
  render () {
    const {
      border = true,

      children,

      ...rest
    } = this.props

    return (
      <div
        className = {
          cs(style['footer'], {
            [style['footer-border']]: border
          })
        }

        { ...rest }
      >
        { children }
      </div>
    )
  }
}

App.Menu = Menu

export default App
