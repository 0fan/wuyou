import React, { Component } from 'react'
import cs from 'classnames'

import Animate from 'rc-animate'
import { Alert } from 'antd'

import style from './index.less'

export default props => {
  const {
    fixed,
    message,

    ...rest
  } = props

  let visible = false

  if (
    typeof message === 'string' &&
    message.length
  ) {
    visible = true
  } else if (message) {
    visible  = true
  }

  return (
    <Animate transitionName = 'slide-up'>
      {
        visible ?
          <div
            className = {
              cs(style.alert, {
                [style['alert-fixed']]: fixed
              })
            }
          >
            <Alert
              banner
              message = { message }

              { ...rest }
            />
          </div> :
          null
      }
    </Animate>
  )
}