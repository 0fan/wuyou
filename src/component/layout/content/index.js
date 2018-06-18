import React, { Component } from 'react'
import cs from 'classnames'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      children,
      grey,
      flex,

      ...rest
    } = this.props

    return (
      <div
        className = {
          cs(style['content'], {
            [style['content-grey']]: grey,
            [style['content-flex']]: flex
          })
        }

        id = 'content'

        { ...rest }
      >
        { children }
      </div>
    )
  }
}
