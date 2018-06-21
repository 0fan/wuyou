import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import qs from 'qs'

import Context from 'context/config'

import { Form, Input } from 'antd'
import { Picker } from 'antd-mobile'
import SegmentedControl from 'component/segmentedControl'
import Slider from 'component/slider'
import Button from 'component/button'

import { valid_money } from 'config/form-rule'

import style from './index.less'

const getDate = () => ([
  Array(31).fill(0).map((v, i) => ({
    label: i + 1 + '日',
    value: i + 1
  }))
])

@Form.create()
export default class App extends Component {
  state = {
    date: '',
    period: 20
  }

  handleChange = (e, type) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    const value = Number(e.target.value)

    const total = Number(getFieldValue('total'))
    const business = Number(getFieldValue('business'))
    const provident = Number(getFieldValue('provident'))

    if (_.isNaN(value)) { return }

    switch (type) {
      case 'total':
        if (!_.isNaN(business)) {
          setFieldsValue({
            provident: value - business
          })
        }

        break
      case 'business':
        if (!_.isNaN(total)) {
          setFieldsValue({
            provident: total - value
          })
        } else if (!_.isNaN(provident)) {
          setFieldsValue({
            total: value - provident
          })
        }

        break
      case 'provident':
        if (!_.isNaN(total)) {
          setFieldsValue({
            business: total - value
          })
        } else if (!_.isNaN(business)) {
          setFieldsValue({
            total: value - business
          })
        }

        break
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, val) => {
      if (!err) {
        console.log(val)
      }
    })
  }

  render () {
    const { getFieldProps, getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form

    getFieldProps('business_rate_default', {
      initialValue: {
        index: 0,
        value: 4.9
      }
    })

    getFieldProps('provident_rate_default', {
      initialValue: {
        index: 0,
        value: 3.5
      }
    })

    return (
      <Fragment>
        <Form
          className = { style.form }
          onSubmit = { this.handleSubmit }
        >
          <Form.Item
            label = '贷款总额(万)'
          >
            {
              getFieldDecorator('total', {
                validateFirst: true,
                rules: valid_money('贷款总额'),
                onChange: e => this.handleChange(e, 'total')
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
                validateFirst: true,
                rules: valid_money('商业贷款'),
                onChange: e => this.handleChange(e, 'business')
              })(
                <Input size = 'large' />
              )
            }
          </Form.Item>
          <Form.Item
            label = '贷款利率'
          >
            <SegmentedControl
              minHeight = { 56 }
              selectedIndex = { getFieldValue('business_rate_default').index }
              values = { [{
                label: {
                  title: '基准利率',
                  value: '4.9%'
                },
                value: 4.9
              }, {
                label: '手动输入',
                value: ''
              }] }
              onChange = { (e, v) => setFieldsValue({ business_rate_default: {
                index: e.nativeEvent.selectedSegmentIndex,
                value: v.value
              } }) }
            />
          </Form.Item>
          {
            getFieldValue('business_rate_default').value === '' ?
              <Form.Item
                label = '商业贷款利率'
              >
                {
                  getFieldDecorator('business_rate', {
                    validateFirst: true,
                    rules: valid_money('商业贷款利率')
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
                validateFirst: true,
                rules: valid_money('公积金贷款'),
                onChange: e => this.handleChange(e, 'provident')
              })(
                <Input size = 'large' />
              )
            }
          </Form.Item>
          <Form.Item
            label = '贷款利率'
          >
            <SegmentedControl
              minHeight = { 56 }
              selectedIndex = { getFieldValue('provident_rate_default').index }
              values = { [{
                label: {
                  title: '公积金利率',
                  value: '3.5%'
                },
                value: 3.5
              }, {
                label: '手动输入',
                value: ''
              }] }
              onChange = { (e, v) => setFieldsValue({ provident_rate_default: {
                index: e.nativeEvent.selectedSegmentIndex,
                value: v.value
              } }) }
            />
          </Form.Item>
          {
            getFieldValue('provident_rate_default').value === '' ?
              <Form.Item
                label = '公积金贷款利率'
              >
                {
                  getFieldDecorator('provident_rate', {
                    validateFirst: true,
                    rules: valid_money('公积金贷款利率')
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
              value = { this.state.period }
              onChange = { v => this.setState({ period: v }) }

              step = { 5 }
              min = { 5 }
              max = { 30 }
              defaultValue = { 20 }
              suffix = '年'
            />
          </Form.Item>
          <Form.Item
            label = '每月还款日'
          >
            <Picker
              data = { getDate() }

              value = { this.state.date }
              onChange = { v => this.setState({ date: v }) }

              cascade = { false }
            >
              <CustomPickerChildren>
                {
                  this.state.date ?
                    <span className = 'ant-form-text'>{ this.state.date.join('') }日</span> :
                    <span className = 'ant-form-text'>选择日期</span>
                }
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