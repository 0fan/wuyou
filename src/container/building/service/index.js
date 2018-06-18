import React, { Component } from 'react'
import cs from 'classnames'

import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

import style from './index.less'

export default () => {
  return (
    <Tool
      data = {
        [{
          title: '在线选房',
          type: 'choice_house',
          to: '/service/choice_house'
        }, {
          title: '房贷计算器',
          type: 'loan_calculator',
          to: '/service/loan_calculator'
        }, {
          title: '税务计算器',
          type: 'tax_calculator',
          to: '/service/tax_calculator'
        }, {
          title: '预约看房',
          type: 'appointment',
          to: '/service/appointment'
        }]
      }
    />
  )
}

const Tool = props => {
  const {
    data = [],
    children,

    ...rest
  } = props

  return (
    <div className = { style['tool-list'] }>
      <Row gutter = { 10 }>
        {
          data.map((v, i) => (
            <Tool.Item
              { ...v }

              key = { i }
            />
          ))
        }
      </Row>
    </div>
  )
}

Tool.Item = props => (
  <Col span = { 8 }>
    <Link to = { props.to } className = { cs(style['tool-item'], { [style[`tool-item-${ props.type }`]]: props.type }) }>
      <div className = { style['tool-item-title'] }>{ props.title }</div>
    </Link>
  </Col>
)
