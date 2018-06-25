import React, { Component, Fragment } from 'react'
import cs from 'classnames'
import qs from 'qs'
import _ from 'lodash'

import BottomText from 'component/bottom-text'

import style from './inde.less'

export default class App extends Component {
  constructor (props) {
    super(props)

    const query = qs.parse(props.history.location.search.replace(/^\?/g, ''))

    const area = !_.isNaN(parseFloat(query.area)) ? parseFloat(query.area) : 0
    const first = !_.isNaN(parseFloat(query.first)) ? parseFloat(query.first) : 0
    const price = !_.isNaN(parseFloat(query.price)) ? parseFloat(query.price) : 0
    const type = !_.isNaN(parseFloat(query.type)) ? parseFloat(query.type) : 0

    const total = area * price

    let tax = 0

    // 首套1%
    if (first === 0) {
      tax = total * 0.03
    } else {
      if (area <= 90) {
        tax = total * 0.01
      } else if (area > 90 && area <= 144) {
        tax = total * 0.015
      } else {
        tax = total * 0.03
      }
    }

    this.state = {
      area,
      first,
      price,
      type,

      total,
      tax
    }
  }

  render () {
    return (
      <Wrap>
        <Box title = '房款总额' value = { `${ this.state.total }元` } />
        <Box title = '契税' value = { `${ this.state.tax }元` } />
        <Box title = '合计' value = { `${ this.state.total + this.state.tax }元` } reverse />
        <BottomText>计算结果仅供参考</BottomText>
      </Wrap>
    )
  }
}

const Wrap = props => (
  <div className = { style['wrap'] }>{ props.children }</div>
)

const Box = props => {
  const {
    title,
    value,
    reverse
  } = props

  return (
    <div
      className = {
        cs(style['box'], {
          [style['box-reverse']]: reverse
        })
      }
    >
      <div className = { style['box-title'] }>{ title }</div>
      <div className = { style['box-value'] }>{ value }</div>
    </div>
  )
}