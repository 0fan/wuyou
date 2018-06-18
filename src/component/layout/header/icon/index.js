import React, { Component } from 'react'
import cs from 'classnames'

import style from './index.less'

export default props => {
  const {
    type,
    children,

    ...rest
  } = props

  return (
    <div
      className = {
        cs(
          style['icon'],
          {
            [style[`icon-${ type }`]]: type
          }
        )
      }
      { ...rest }
    >
      { children }
    </div>
  )
}