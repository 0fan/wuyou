import React, { Component, Fragment } from 'react'
import qs from 'qs'

import { Form, Input } from 'antd'
import { Picker } from 'antd-mobile'
import SegmentedControl from 'component/segmentedControl'
import Tabs from 'component/tabs'
import Slider from 'component/slider'
import Button from 'component/button'

import { valid_money } from 'config/form-rule'

import style from './index.less'

const getDate = () => [
  Array(31).fill(0).map((v, i) => ({
    label: i + 1 + '日',
    value: i + 1
  }))
]

const tabs = [{
  title: '按房价总额'
}, {
  title: '按单价面积'
}]

export default class App extends Component {
  handleSubmit (data, type) {
    const { history } = this.props

    const {
      total,

      area,
      price,

      ratio,

      rate_default,
      rate,
      period,
      date
    } = data

    let query = {
      rate: rate_default.value !== '' ? rate_default.value : rate,
      period,
      date: date ? date.join('') : ''
    }

    if (type === 'total') {
      query.total = parseFloat(total) * 10000 * (1 - ratio / 100)
    }

    if (type === 'area') {
      query.total = parseFloat(area) * parseFloat(price) * (1 - ratio / 100)
    }

    history.push(`/service/loan_calculator/result?${ qs.stringify(query) }`)
  }

  render () {
    return (
      <Fragment>
        <Tabs tabs = { tabs }>
          <Total onSubmit = { v => this.handleSubmit(v, 'total') } />
          <Area onSubmit = { v => this.handleSubmit(v, 'area') } />
        </Tabs>
      </Fragment>
    )
  }
}

@Form.create()
class Total extends Component {
  state = {
    // 首付比例
    ratio: 30,
    date: '',
    period: 20
  }

  handleSubmit = (e, type) => {
    e.preventDefault()

    const { onSubmit } = this.props

    this.props.form.validateFields((err, val) => {
      if (!err) {
        onSubmit({
          ...val,
          ...this.state
        })
      }
    })
  }

  render () {
    const { getFieldProps, getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form

    getFieldProps('rate_default', {
      initialValue: {
        index: 0,
        value: 4.9
      }
    })

    return (
      <Form
        className = { style.form }
        onSubmit = { this.handleSubmit }
      >
        <Form.Item
          label = '房价总额(万)'
        >
          {
            getFieldDecorator('total', {
              validateFirst: true,
              rules: valid_money('房价总额')
            })(
              <Input size = 'large' />
            )
          }
        </Form.Item>
        <Form.Item
          label = '首付比例'
        >
          <Slider
            value = { this.state.ratio }
            onChange = { v => this.setState({ ratio: v }) }

            step = { 10 }
            min = { 10 }
            max = { 90 }
            suffix = '%'
          />
        </Form.Item>
        <Form.Item
          label = '贷款年限'
        >
          <Slider
            value = { this.state.period }
            onChange = { v => this.setState({ period: v }) }

            step = { 1 }
            min = { 1 }
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
        <Form.Item
          label = '贷款利率'
        >
          <SegmentedControl
            minHeight = { 56 }
            selectedIndex = { getFieldValue('rate_default').index }
            values = { [{
              label: {
                title: '基准利率',
                value: '4.9%'
              },
              value: 4.9
            }, {
              label: {
                title: '公积金利率',
                value: '3.2%'
              },
              value: 3.2
            }, {
              label: '手动输入',
              value: ''
            }] }
            onChange = { (e, v) => setFieldsValue({ rate_default: {
              index: e.nativeEvent.selectedSegmentIndex,
              value: v.value
            } }) }
          />
        </Form.Item>
        {
          getFieldValue('rate_default').value === '' ?
            <Form.Item
              label = '贷款利率'
            >
              {
                getFieldDecorator('rate', {
                  validateFirst: true,
                  rules: valid_money('贷款利率')
                })(
                  <Input size = 'large' />
                )
              }
            </Form.Item> :
            null

        }
        <Button htmlType = 'submit' type = 'primary'>开始计算</Button>
      </Form>
    )
  }
}

@Form.create()
class Area extends Component {
  state = {
    // 首付比例
    ratio: 30,
    date: '',
    period: 20
  }

  handleSubmit = (e, type) => {
    e.preventDefault()

    const { onSubmit } = this.props

    this.props.form.validateFields((err, val) => {
      if (!err) {
        onSubmit({
          ...val,
          ...this.state
        })
      }
    })
  }

  render () {
    const { getFieldProps, getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form

    getFieldProps('rate_default', {
      initialValue: {
        index: 0,
        value: 4.9
      }
    })

    return (
      <Form
        className = { style.form }
        onSubmit = { this.handleSubmit }
      >
        <Form.Item
          label = '户型面积（m²）'
        >
          {
            getFieldDecorator('area', {
              validateFirst: true,
              rules: valid_money('户型面积')
            })(
              <Input size = 'large' />
            )
          }
        </Form.Item>
        <Form.Item
          label = '每平米单价（元）'
        >
          {
            getFieldDecorator('price', {
              validateFirst: true,
              rules: valid_money('每平米单价')
            })(
              <Input size = 'large' />
            )
          }
        </Form.Item>
        <Form.Item
          label = '首付比例'
        >
          <Slider
            value = { this.state.ratio }
            onChange = { v => this.setState({ ratio: v }) }

            step = { 10 }
            min = { 10 }
            max = { 90 }
            suffix = '%'
          />
        </Form.Item>
        <Form.Item
          label = '贷款年限'
        >
          <Slider
            value = { this.state.period }
            onChange = { v => this.setState({ period: v }) }

            step = { 1 }
            min = { 1 }
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
        <Form.Item
          label = '贷款利率'
        >
          <SegmentedControl
            minHeight = { 56 }
            selectedIndex = { getFieldValue('rate_default').index }
            values = { [{
              label: {
                title: '基准利率',
                value: '4.9%'
              },
              value: 4.9
            }, {
              label: {
                title: '公积金利率',
                value: '3.2%'
              },
              value: 3.2
            }, {
              label: '手动输入',
              value: ''
            }] }
            onChange = { (e, v) => setFieldsValue({ rate_default: {
              index: e.nativeEvent.selectedSegmentIndex,
              value: v.value
            } }) }
          />
        </Form.Item>
        {
          getFieldValue('rate_default').value === '' ?
            <Form.Item
              label = '贷款利率'
            >
              {
                getFieldDecorator('rate', {
                  validateFirst: true,
                  rules: valid_money('贷款利率')
                })(
                  <Input size = 'large' />
                )
              }
            </Form.Item> :
            null

        }
        <Button htmlType = 'submit' type = 'primary'>开始计算</Button>
      </Form>
    )
  }
}

const CustomPickerChildren = props => (
  <div onClick = { props.onClick }>{ props.children }</div>
)