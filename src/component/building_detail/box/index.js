import React, { Component } from 'react'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      title,
      titleExtra,
      children,
      rightContent,
      leftContent,

      ...rest
    } = this.props

    return (
      <div className = { style['box'] }>
        <div className = { style['box-header'] }>
          <div className = { style['box-header-left'] }>
            <div className = { style['box-header-title'] }>{ title }</div>
            <div className = { style['box-header-extra'] }>{ titleExtra }</div>
            { leftContent }
          </div>
          <div className = { style['box-header-right'] }>{ rightContent }</div>
        </div>
        <div className = { style['box-body'] }>
          { children }
        </div>
      </div>
    )
  }
}
