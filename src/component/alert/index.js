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

  return (
    <Animate transitionName = 'slide-up'>
      {
        message && message.length ?
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