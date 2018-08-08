import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import cs from 'classnames'
import Animate from 'rc-animate'
import { createPortal } from 'react-dom'

import style from './index.less'

const $root = document.querySelector('body')

export default class App extends Component {
  constructor (props) {
    super(props)

    this.el = document.createElement('div')
  }

  componentDidMount () {
    root.appendChild(this.el)
  }

  componentWillUnmount () {
    root.removeChild(this.el)
  }

  nativeEvent = e => {
    e.stopPropagation()
  }

  isSelect = (value, data) => {
    return data.value === value
  }

  handleMaskClick = e => {
    const {
      onMaskClick
    } = this.props

    onMaskClick && onMaskClick(e)
  }

  render () {
    const {
      visible,
      value,
      data,
      top = 0,
      children,
      onClick = f => f,

      ...rest
    } = this.props

    return createPortal(
      <div onClick = { e => e.nativeEvent.stopImmediatePropagation() }>
        {
          visible ?
            <div className = { style['root'] } style = { { top } }>
              <div className = { style['mask'] } onClick = { this.handleMaskClick } />
              <div className = { style['list'] } onClick = { e => e.stopPropagation() }>
                {
                  data.map((v, i) => (
                    <div
                      onClick = { e => { onClick(v, i, e) } }
                      className = { cs(style['item'], { [style['item-select']]: this.isSelect(value, v) }) }
                      key = { i }
                    >
                      <span>{ v.label }</span>
                    </div>
                  ))
                }
              </div>
            </div> :
            null
        }
      </div>,
      this.el
    )
  }
}