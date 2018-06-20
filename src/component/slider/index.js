import React, { Component } from 'react'

import { Slider } from 'antd-mobile'

import style from './index.less'

export default class App extends Component {
  $el = null
  $slider = null

  static defaultProps = {
    onChange: f => f,
    suffix: ''
  }

  componentDidMount () {
    this.$slider = this.$el.querySelector('[aria-valuenow]')

    if (this.$slider) {
      this.$slider.setAttribute('valuenow', this.$slider.getAttribute('aria-valuenow') + this.props.suffix)
    }
  }

  handleChange = v => {
    const { onChange } = this.props

    setTimeout(() => {
      const { suffix } = this.props
      const value = this.$slider.getAttribute('aria-valuenow')

      if (suffix && !new RegExp(`${ suffix }$`).test(value)) {
        this.$slider.setAttribute('valuenow', value + suffix)
      }
    }, 0)

    onChange(v)
  }

  render () {
    const {
      onChange,

      ...rest
    } = this.props

    return (
      <div className = { style.slider } ref = { el => this.$el = el }>
        <Slider onChange = { this.handleChange } { ...rest } />
      </div>
    )
  }
}