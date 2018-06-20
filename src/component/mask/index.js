import React, { Component, Fragment } from 'react'
import { createPortal } from 'react-dom'

import Animate from 'rc-animate'

import style from './index.less'

const modalRoot = document.querySelector('body')

export default class Mask extends Component {
  constructor (props) {
    super(props)

    this.el = document.createElement('div')
  }

  componentDidMount () {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    modalRoot.removeChild(this.el)
  }

  render () {
    const {
      visible,
      onMaskClick,

      top = 0,
      zIndex = 1000,

      animate = true,

      ...rest
    } = this.props

    const styleString = {
      top,
      zIndex
    }

    if (animate) {
      return createPortal(
        <Animate transitionName = 'fade'>
          {
            visible ?
              <div style = { styleString } className = { style.mask } onClick = { onMaskClick }></div> :
              null
          }
        </Animate>,
        this.el
      )
    }

    return createPortal(
      visible ?
        <div style = { styleString } className = { style.mask } onClick = { onMaskClick }></div> :
        null,
      this.el
    )
  }
}
