import React, { Component, Fragment } from 'react'
import axios from 'axios'

import { Toast, List, TextareaItem } from 'antd-mobile'
import Alert from 'component/alert'
import Button from 'component/button'

import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { feedback } = api.i

export default class App extends Component {
  state = {
    text: ''
  }

  submit = async () => {
    const { text } = this.state

    if (!text.length) {
      Toast.fail('请输入反馈内容', 3, null, false)

      return
    }

    if (text.length < 10) {
      Toast.fail('内容不低于10个字', 3, null, false)

      return
    }

    Toast.loading('发送中...', 0, null, true)

    const [err, res] = await axios.post(server + feedback, {
      content: text
    })

    Toast.hide()

    if (err) {
      Toast.fail(err, 3, null, false)

      return
    }

    // 清空
    this.setState({ text: '' })

    Toast.success('发送成功', 3, () => {
      this.props.history.push('/i')
    }, false)
  }

  componentWillUnmount () {
    Toast.hide()
  }

  render () {
    return (
      <Fragment>
        <Alert
          message = '内容不低于10个字'
          type = 'info'
          showIcon = { false }
        />
        <TextareaItem
          value = { this.state.text }
          onChange = { v => this.setState({ text: v }) }

          placeholder = '请输入反馈内容'
          rows = { 5 }
          count = { 500 }
          autoHeight
        />
        <div className = { style.submit }>
          <Button onClick = { this.submit } size = 'large' type = 'primary'>提交</Button>
        </div>
      </Fragment>
    )
  }
}
