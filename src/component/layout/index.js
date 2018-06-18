import React, { Component } from 'react'
import cs from 'classnames'

import Header from './header'
import Content from './content'
import Footer from './footer'

import style from './index.less'

class App extends Component {
  render () {
    const {
      fixed,
      children,
      className,

      ...rest
    } = this.props

    const classString = cs(style['layout'], { [style['layout-fixed']]: fixed }, className)

    return (
      <div className = { classString } { ...rest }>{ children }</div>
    )
  }
}

App.Header = Header
App.Content = Content
App.Footer = Footer

export default App
