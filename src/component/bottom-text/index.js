import React, { Component } from 'react'

import style from './index.less'

export default props => {
  const {
    children,
    ...rest
  } = props

  return (
    <div
      className = { style.text }

      { ...rest }
    >
      { children }
    </div>
  )
}