import React, { Component } from 'react'

import Modal from 'rc-dialog'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      children,
      onClose = f => f,

      ...rest
    } = this.props

    return (
      <Modal
        wrapClassName = { style.alert }
        maskAnimation = 'fade'
        animation = 'zoom'
        onClose = { onClose }
        closable = { false }

        { ...rest }
      >
        { children }
        <Close onClick = { onClose } />
      </Modal>
    )
  }
}

const Close = props => (
  <div className = { style.close } onClick = { props.onClick }></div>
)