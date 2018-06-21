import React, { Component, Fragment } from 'react'
import _ from 'lodash'

import Layout from 'component/layout'

import { getHashParams } from 'util/getHashParameter'

import style from './index.less'

const { Content, Footer } = Layout

export default class App extends Component {
  constructor (props) {
    super(props)

    const urlParams = getHashParams()

    const calcType = urlParams.calcType ? parseFloat(urlParams.calcType) : 0
    const yearRate = urlParams.rate ? parseFloat(urlParams.rate) : 0
    const period = urlParams.period ? parseFloat(urlParams.period) : 0
    const total = urlParams.total ? parseFloat(urlParams.total) : 0
    const date = urlParams.date

    const result = this.calc({
      calcType,
      yearRate,
      period,
      total
    })

    this.state = {
      // 计算需要的变量
      // 年利率
      yearRate,
      // 期数，这里单位是年
      period,
      // 贷款的总金额
      total,

      // 结果数据
      // 每月还款金额
      monthRefund: 0,
      // 总还款金额
      totalRefund: 0,
      // 支付的总利息
      totalInterest: 0,
      // 如果是等额本金每月递减的金额
      reduce: 0,

      // 计算方式
      // 0 等额本息
      // 1 等额本金
      calcType,

      // 每月还款日
      date,

      // 是否显示还款提醒按钮
      visibleNotice: true,

      ...result
    }
  }

  calc = ({ calcType, yearRate, period, total }) => {
    if (!yearRate || !period || !total) {
      return {}
    }

    if (calcType === 0) {
      return this.calcACPI({ yearRate, period, total })
    }
    if (calcType === 1) {
      return this.calcAC({ yearRate, period, total })
    }
  }

  // 计算等额本息 Average Capital Plus Interest
  calcACPI = ({ yearRate, period, total }) => {
    const monthRate = yearRate / 100 / 12
    const monthPeriod = period * 12

    // 每月还款
    const monthRefund = total * monthRate * Math.pow(1 + monthRate, monthPeriod) / (Math.pow(1 + monthRate, monthPeriod) - 1)

    // 总还款金额 = 每月还款金额 * 期数
    const totalRefund = monthRefund * monthPeriod
    // 总利息 = 总还款金额 - 总贷款金额
    const totalInterest = totalRefund - total

    return {
      monthRefund,
      totalRefund,
      totalInterest
    }
  }

  // 计算等额本金 Average Capital
  calcAC = ({ yearRate, period, total }) => {
    const monthRate = yearRate / 100 / 12
    const monthPeriod = period * 12

    // 每月偿还的本金
    const monthCapitalRefund = total / monthPeriod
    // 每月递减的金额
    const reduce = total / monthPeriod * monthRate
    // 每月还款
    const monthRefund = []

    // 总返款金额
    let totalRefund = 0
    // 总利息
    let totalInterest = 0

    for (let i = 0, len = monthPeriod; i < len; i++) {
      const _capitalRefund = monthCapitalRefund + (total - i * monthCapitalRefund) * monthRate

      monthRefund.push(_capitalRefund)
      totalRefund += _capitalRefund
    }

    totalInterest = totalRefund - total

    return {
      monthRefund: monthRefund[0],
      totalRefund,
      totalInterest,
      reduce
    }
  }

  // 切换计算方式
  switchCalaType = () => {
    this.setState(prevState => ({
      calcType: prevState.calcType === 0 ? 1 : 0,

      ...this.calc({
        calcType: prevState.calcType === 0 ? 1 : 0,
        yearRate: prevState.yearRate,
        period: prevState.period,
        total: prevState.total,
      })
    }))
  }

  // 添加至还款提醒
  handleNotice = () => {}

  render () {
    const {
      children,

      ...rest
    } = this.props

    return (
      <Fragment>
        <Content>
          <Focus
            value = { this.state.monthRefund }
            reduce = { this.state.reduce }
            date = { this.state.date }
            type = { this.state.calcType }

            onSwitch = { this.switchCalaType }
          />
          <Panel>
            <Item title = '贷款总额' value = { this.state.total } />
            <Item title = '支付利息' value = { this.state.totalInterest } />
            <Item title = '还款总额' value = { this.state.totalRefund } />
            <Item title = '还款月数' value = { this.state.period * 12 } />
          </Panel>
        </Content>
        {
          this.state.date ?
            <Footer border = { false }>
              <div className = { style['fixed-btn'] } onClick = { this.handleNotice }>添加至还款提醒</div>
            </Footer> :
            null
        }
      </Fragment>
    )
  }
}

const Focus = props => {
  const {
    value,
    reduce,
    date,
    type,
    onSwitch,

    ...rest
  } = props

  return (
    <div className = { style.focus }>
      <h1>{ _.isNumber(value) ? value.toFixed(2) : value } <sub>（元）</sub></h1>
      {
        type === 1 && reduce ?
          <div className = { style['focus-extra'] }>每月递减{ _.isNumber(reduce) ? reduce.toFixed(2) : reduce }元</div> :
          null
      }
      {
        date ?
          <div className = { style['focus-extra'] }>每月{ date }号还款额</div> :
          null
      }
      <div className = { style['focus-switch'] } onClick = { onSwitch }>
        {
          type === 0 ? '等额本息' : '等额本金'
        }
      </div>
    </div>
  )
}

const Panel = props => {
  const { children, ...rest } = props

  return (
    <div className = { style.panel } { ...rest }>
      { children }
    </div>
  )
}

const Item = props => {
  const { title, value, children, ...rest } = props

  return (
    <div className = { style['panel-item'] }>
      <div className = { style['panel-item-title'] }>{ title }</div>
      <div className = { style['panel-item-value'] }>{ _.isNumber(value) ? value.toFixed(2) : value }</div>
    </div>
  )
}