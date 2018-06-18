import React, { Component, Fragment } from 'react'

import { List, TextareaItem } from 'antd-mobile'
import Alert from 'component/alert'
import Button from 'component/button'

import style from './index.less'

export default class App extends Component {
  render () {
    return (
      <Fragment>
        <Alert
          message = '内容不低于10个字'
          type = 'info'
          showIcon = { false }
        />
        <TextareaItem
          placeholder = '请输入反馈内容'
          rows = { 5 }
          count = { 500 }
          autoHeight
        />
        <div className = { style.submit }>
          <Button size = 'large' type = 'primary'>提交</Button>
        </div>
      </Fragment>
    )
  }
}
