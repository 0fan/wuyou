import React, { Component, Fragment } from 'react'

import Context from 'context/config'

import { Form, Input } from 'antd'
import { Picker } from 'antd-mobile'
import SegmentedControl from 'component/segmentedControl'
import Slider from 'component/slider'
import Button from 'component/button'

import style from './index.less'

const date = [
  Array(31).fill(0).map((v, i) => ({
    label: i + 1 + '日',
    value: i + 1
  }))
]

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

    if (!contentConfig.grey) {
      changeContent({ grey: true })
    }
  }

  render () {
    const { getFieldProps, getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form

    return (
      <Fragment>
        <Form className = { style.form }>
          <Form.Item
            label = '贷款总额(万)'
          >
            {
              getFieldDecorator('total', {
                rules: [{
                  required: true,
                  message: '请输入贷款总额'
                }]
              })(
                <Input size = 'large' />
              )
            }
          </Form.Item>
          <Form.Item
            label = '商业贷款(万)'
          >
            {
              getFieldDecorator('business', {
                rules: [{
                  required: true,
                  message: '请输入商业贷款'
                }]
              })(
                <Input size = 'large' />
              )
            }
          </Form.Item>
          <Form.Item
            label = '贷款利率'
          >
            <SegmentedControl
              selectedIndex = { getFieldValue('business_rate_default') }
              values = { ['基准利率(4.9%)', '手动输入'] }
              onChange = { e => setFieldsValue({ business_rate_default: e.nativeEvent.selectedSegmentIndex }) }
            />
          </Form.Item>
          {
            getFieldValue('business_rate_default') === 1 ?
              <Form.Item
                label = '商业贷款利率'
              >
                {
                  getFieldDecorator('business_rate', {
                    rules: [{
                      required: true,
                      message: '请输入商业贷款利率'
                    }]
                  })(
                    <Input size = 'large' />
                  )
                }
              </Form.Item> :
              null

          }
          <Form.Item
            label = '公积金(万)'
          >
            {
              getFieldDecorator('provident', {
                rules: [{
                  required: true,
                  message: '请输入公积金贷款'
                }]
              })(
                <Input size = 'large' />
              )
            }
          </Form.Item>
          <Form.Item
            label = '贷款利率'
          >
            <SegmentedControl
              selectedIndex = { getFieldValue('provident_rate_default') }
              values = { ['公积金利率(3.5%)', '手动输入'] }
              onChange = { e => setFieldsValue({ provident_rate_default: e.nativeEvent.selectedSegmentIndex }) }
            />
          </Form.Item>
          {
            getFieldValue('provident_rate_default') === 1 ?
              <Form.Item
                label = '公积金贷款利率'
              >
                {
                  getFieldDecorator('provident_rate', {
                    rules: [{
                      required: true,
                      message: '请输入公积金贷款利率'
                    }]
                  })(
                    <Input size = 'large' />
                  )
                }
              </Form.Item> :
              null

          }
          <Form.Item
            label = '贷款年限'
          >
            <Slider
              step = { 5 }
              min = { 5 }
              max = { 30 }
              suffix = '年'
            />
          </Form.Item>
          <Form.Item
            label = '每月还款日'
          >
            <Picker
              data = { date }

              cascade = { false }
            >
              <CustomPickerChildren>
                <span className = 'ant-form-text'>选择日期</span>
              </CustomPickerChildren>
            </Picker>
          </Form.Item>
          <Button htmlType = 'submit' type = 'primary'>开始计算</Button>
        </Form>
      </Fragment>
    )
  }
}

const CustomPickerChildren = props => (
  <div onClick = { props.onClick }>{ props.children }</div>
)

export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)