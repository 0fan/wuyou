import React, { Component } from 'react'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      title,
      tag = [],
      price,

      children,

      ...rest
    } = this.props

    return (
      <div className = { style.focus }>
        <div className = { style['focus-content'] }>
          <div className = { style['focus-title'] }>{ title }</div>
          {
            tag.length ?
              <div className = { style['focus-tag-wrap'] }>
                {
                  tag.map((v, i) => (
                    <div className = { style['focus-tag'] } key = { i }>{ v }</div>
                  ))
                }
              </div> :
              null
          }
        </div>
        <div className = { style['focus-right'] }>
          <div className = { style['focus-price'] }>
            <span className = { style['focus-price-title'] }>参考价</span>
            <span className = { style['focus-price-value'] }>{ price }</span>
          </div>
        </div>
      </div>
    )
  }
}
