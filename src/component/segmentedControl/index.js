import React, { Component } from 'react'

import { SegmentedControl } from 'antd-mobile'

import style from './index.less'

export default props => {
  const {
    ...rest
  } = props

  return (
    <SegmentedControl className = { style['switch'] } { ...rest } />
  )
}