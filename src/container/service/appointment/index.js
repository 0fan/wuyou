import React, { Component, Fragment } from 'react'

import Context from 'context/config'
import { Form, Input } from 'antd'
import { Modal } from 'antd-mobile'
import Layout from 'component/layout'

import style from './index.less'

const { Content, Footer } = Layout
const { alert } = Modal

@Form.create()
class App extends Component {
  state = {
    title: '融创九樾府',
  }

  componentDidMount () {
    const {
      contentConfig,
      changeContent,
      footerConfig,
      changeFooter
    } = this.props

    if (footerConfig.length) {
      changeFooter([])
    }

    if (!contentConfig.flex) {
      changeContent({ flex: true })
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    this.props.form.validateFields((err, val) => {
      if (!err) {
        console.log(err, val)

        alert('预约成功', '请耐心等待置业顾问与您联系')
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <Fragment>
        <Content>
          <div className = { style.title }>{ this.state.title }</div>
          <Form
            onSubmit = { this.handleSubmit }
            className = { style.form }
          >
            <Form.Item
              label = '姓名'
            >
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入真实姓名'
                  }]
                })(
                  <Input placeholder = '请输入您的真实姓名' size = 'large' />
                )
              }
            </Form.Item>
            <Form.Item
              label = '电话'
            >
              {
                getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    message: '请输入手机号'
                  }]
                })(
                  <Input placeholder = '请输入您手机号' size = 'large' />
                )
              }
            </Form.Item>
          </Form>
        </Content>
        <Footer>
          <div className = { style['submit'] } onClick = { this.handleSubmit }>提交预约</div>
        </Footer>
      </Fragment>
    )
  }
}

export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)