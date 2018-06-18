import React, { Component, Fragment } from 'react'

import Context from 'context/config'
import { Form, Input } from 'antd'
import { Modal } from 'antd-mobile'
import SegmentedControl from 'component/segmentedControl'
import Layout from 'component/layout'
import BottomText from 'component/bottom-text'

import style from './index.less'

const { Content, Footer } = Layout
const { alert } = Modal

@Form.create()
class App extends Component {
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

  handleRest = () => {
    this.props.form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    this.props.form.validateFields((err, val) => {
      if (!err) {
        console.log(err, val)

        this.props.history.push('/service/tax_calculator/result')
      }
    })
  }

  render () {
    const { getFieldProps, getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form

    getFieldProps('type', {
      initialValue: 0
    })

    getFieldProps('first', {
      initialValue: 0
    })

    return (
      <Fragment>
        <Content>
          <Form
            onSubmit = { this.handleSubmit }
            className = { style.form }
          >
            <Form.Item
              label = '房屋类型（暂只支持新房）'
            >
              <SegmentedControl
                selectedIndex = { getFieldValue('type') }
                values = { ['新房'] }
                onChange = { e => setFieldsValue({ type: e.nativeEvent.selectedSegmentIndex }) }
              />
            </Form.Item>
            <Form.Item
              label = '购房家庭首次购房'
            >
              <SegmentedControl
                selectedIndex = { getFieldValue('first') }
                values = { ['是', '否'] }
                onChange = { e => setFieldsValue({ first: e.nativeEvent.selectedSegmentIndex }) }
              />
            </Form.Item>
            <Form.Item
              label = '房屋面积(m²)'
            >
              {
                getFieldDecorator('area', {
                  rules: [{
                    required: true,
                    message: '请输入房屋面积'
                  }]
                })(
                  <Input size = 'large' />
                )
              }
            </Form.Item>
            <Form.Item
              label = '房屋单价(元／m²)'
            >
              {
                getFieldDecorator('price', {
                  rules: [{
                    required: true,
                    message: '请输入房屋单价'
                  }]
                })(
                  <Input size = 'large' />
                )
              }
            </Form.Item>
          </Form>
          <BottomText>计算结果仅供参考</BottomText>
        </Content>
        <Footer>
          <div className = { style['reset'] } onClick = { this.handleRest }>清空</div>
          <div className = { style['submit'] } onClick = { this.handleSubmit }>添加至还款提醒</div>
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