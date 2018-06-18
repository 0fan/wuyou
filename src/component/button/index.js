import React, { Component } from 'react'
import cs from 'classnames'

import { Button as AntButton } from 'antd'

import style from './index.less'

export default props => {
  const {
    htmlType,

    ...rest
  } = props

  return (
    <AntButton
      className = {
        cs(style.button, {
          [style['button-submit']]: htmlType === 'submit'
        })
      }
      size = 'large'

      htmlType = { htmlType }

      { ...rest }
    />
  )
}