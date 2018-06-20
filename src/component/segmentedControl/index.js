import React, { Component } from 'react'
import _ from 'lodash'

import { SegmentedControl } from 'antd-mobile'

import style from './index.less'

export default class App extends Component {
  static defaultProps = {
    values: [],
    onChange: f => f
  }

  constructor (props) {
    super(props)

    const {
      values
    } = props

    this.state = {
      values
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.values) {
      this.setState({ values: nextProps.values })
    }
  }

  handleChange = e => {
    const { onChange } = this.props

    const index = e.nativeEvent.selectedSegmentIndex

    onChange(e, this.state.values[index])
  }

  render () {
    const {
      values,
      onChange,
      minHeight,

      ...rest
    } = this.props

    let styleString = {}

    if (minHeight) {
      styleString.minHeight = minHeight
    }

    let renderValues = this.state.values

    if (this.state.values.some(v => v && v.label)) {
      renderValues = renderValues.map(v => {
        if (v.label.value) {
          return <Box { ...v.label } key = '0' />
        }

        return <Box value = { v.label } key = '1' />
      })
    }

    return (
      <SegmentedControl
        values = { renderValues }

        onChange = { this.handleChange }

        className = { style['switch'] }
        style = { styleString }

        { ...rest }
      />
    )
  }
}

const Box = props => {
  const {
    title,
    value
  } = props

  return (
    <div className = { style['box'] }>
      {
        title ?
          <div className = { style['box-title'] }>{ title }</div> :
          null
      }
      {
        value ?
          <div className = { style['box-value'] }>{ value }</div> :
          null
      }
    </div>
  )
}