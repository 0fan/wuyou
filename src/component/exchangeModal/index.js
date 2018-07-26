import React, { Component, Fragment } from 'react'
import { Divider, Button, Row, Col } from 'antd'
import { Modal as AntdModal, Toast } from 'antd-mobile'
import _ from 'lodash'
import cs from 'classnames'
import style from './index.less'
import moment from 'moment'

export class CertificateModal extends Component {
  static defaultProps = {
    onClose: f => f,
    onSubmit: f => f
  }

  constructor (props) {
    super(props)

    const {
      data   = [],
      active = 0
    } = props

    this.state = {
      active,
      data
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length) {
      this.setState({ data: nextProps.data })
    }

    if (!_.isNil(nextProps.active)) {
      this.setState({ active: nextProps.active })
    }
  }

  handleSubmit = () => {
    const {
      active = 0,
      data
    } = this.state

    this.props.onSubmit(active, data[active])
  }

  render () {
    const {
      ...rest
    } = this.props

    return (
      <AntdModal
        title = '存款证明切换'
        transparent
        className = { style.modal }

        { ...rest }
      >
        {
          this.state.data.map((v, i) => (
            <div
              className = { cs(style['exchange-box'], { [style['exchange-box-active']]: i === this.state.active }) }
              key = { i }
              onClick = { e => this.setState({ active: i }) }
            >
              { v.name }
              <Divider type = 'vertical' />
              { moment(v.tradeDate).format('YYYY-MM-DD') }
              <Divider type = 'vertical' />
              办理成功
              <Divider type = 'vertical' />
              { v.tradeAmount }
            </div>
          ))
        }
        <div className = { style['modal-action'] } >
          <Row gutter = { 16 } >
            <Col span = { 12 } >
              <Button onClick = { this.props.onClose } >取消</Button>
            </Col>
            <Col span = { 12 } >
              <Button onClick = { this.handleSubmit } type = 'primary' >确定</Button>
            </Col>
          </Row>
        </div>
      </AntdModal>
    )
  }
}

export class NetSignModal extends Component {
  static defaultProps = {
    onClose: f => f
  }

  constructor (props) {
    super(props)

    const {
      data = [],
      active = 0
    } = props

    this.state = {
      active,
      data
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length) {
      this.setState({ data: nextProps.data })
    }

    if (!_.isNil(nextProps.active)) {
      this.setState({ active: nextProps.active })
    }
  }

  handleSubmit = () => {
    const {
      active = 0,
      data
    } = this.state

    const {
      onSubmit = f => f
    } = this.props

    onSubmit(active, data[active])
  }

  render () {
    const {
      ...rest
    } = this.props

    return (
      <AntdModal
        title = '房源切换'
        transparent
        className = { style.modal }

        { ...rest }
      >
        {
          this.state.data.map((v, i) => (
            <div
              className = { cs(style['exchange-box'], style['single-text'], { [style['exchange-box-active']]: i === this.state.active }) }
              key = { i }
              onClick = { e => this.setState({ active: i }) }
            >
              { v.name }
            </div>
          ))
        }
        <div className = { style['modal-action'] }>
          <Row gutter = { 16 }>
            <Col span = { 12 }>
              <Button onClick = { this.props.onClose }>取消</Button>
            </Col>
            <Col span = { 12 }>
              <Button onClick = { this.handleSubmit } type = 'primary'>确定</Button>
            </Col>
          </Row>
        </div>
      </AntdModal>
    )
  }
}