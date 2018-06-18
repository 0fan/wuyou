import React, { Component, Fragment } from 'react'
import cs from 'classnames'
import { connect } from 'react-redux'

import { Divider, Button, Row, Col } from 'antd'
import { Modal as AntdModal, Toast } from 'antd-mobile'
import { Timeline, Box, Steps, Card } from 'component/building_detail'
import Modal from 'component/modal'

import style from './index.less'

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  state = {
    stepIndex: -1,

    step: [{
      name: '存款证明',
      rightContent: <div className = { style['card-btn'] } onClick = { e => { this.handleModal('exchangeVisible', e) } }>切换</div>,
      data: [{
        title: '物业类型',
        value: '高层'
      }, {
        title: '办理时间',
        value: '2018-05-28'
      }, {
        title: '办理状态',
        value: '成功办理'
      }, {
        title: '存款金额',
        value: '￥30000'
      }]
    }, {
      name: '在线开盘',
      rightContent: <div onClick = { e => Toast.fail('休想选房', 3, null, false) } className = { style['card-btn'] }>去选房</div>,
      data: [{
        title: '预计开盘时间',
        value: '2018-05-31'
      }, {
        title: '开盘状态',
        value: '已开盘'
      }, {
        title: '选房资格',
        value: '已具备选房资格'
      }, {
        title: '房源信息',
        value: '暂无'
      }]
    }, {
      name: '购房网签',
      data: [{
        title: '网签状态',
        value: '未办理'
      }, {
        title: '网签时间',
        value: '暂无'
      }, {
        title: '网签地址',
        value: '暂无'
      }, {
        value: <a href = '#' onClick = { e => { this.handleModal('signVisible', e) } }>点击了解网签所需材料</a>
      }]
    }, {
      name: '购房备案',
      data: [{
        title: '备案状态',
        value: '未办理'
      }, {
        title: '备案时间',
        value: '暂无'
      }, {
        value: <a href = '#' onClick = { e => { this.handleModal('recordVisible', e) } }>点击了解备案可取回材料</a>
      }]
    }, {
      name: '房产证',
      data: [{
        title: '办理状态',
        value: '未办理'
      }]
    }],

    certificate: [{
      id: 1,
      type: '高层',
      date: '2018-05-28',
      status: '成功办理',
      price: '￥30000',
    }, {
      id: 2,
      type: '高层',
      date: '2018-05-28',
      status: '成功办理',
      price: '￥30000',
    }],

    certificateId: 1,

    exchangeVisible: false,
    signVisible: false,
    recordVisible: false
  }

  handleModal = (type, e) => {
    e.preventDefault()

    this.setState({
      [type]: true
    })
  }

  renderSteps = () => {
    const { stepIndex, step } = this.state

    return (
      <Box
        title = '购房节点'
        titleExtra = { stepIndex < 0 ? '' : '房号：1-1-3-6' }
      >
        <Steps
          index = { this.state.stepIndex }
          data = { step.map((v, i) => ({
            type: `${ i + 1 }`,
            text: v.name
          })) }
        />
      </Box>
    )
  }

  renderTimeline = () => {
    const { stepIndex, step } = this.state
    const { auth } = this.props.user

    if (!auth) {
      return (
        <div className = { style['tip-box'] }>
          <div className = { style['tip-content'] }>请挑选楼盘并至售楼处办理存款证明后使用该服务</div>
          <div className = { style['tip-action'] }>
            <Button onClick = { e => this.props.history.push('/new_building') }>查看楼盘</Button>
          </div>
        </div>
      )
    }

    return (
      <Box
        title = '节点跟踪'
        titleExtra = { <span><Divider type = 'vertical' />还差<span style = { { color: '#F41906' } }> { step.length - stepIndex - 1 } </span>步完成所有节点</span> }
      >
        <Timeline>
          {
            step.map((v, i) => {
              let type = ''
              let leftContent = null
              let rightContent = null

              if (i <= stepIndex) {
                if (i === stepIndex) {
                  type = 'blue'
                } else {
                  type = 'darkblue'
                }

                rightContent = () => <span className = { style['card-complete'] }>已完成</span>

                if (v.rightContent) {
                  leftContent = () => v.rightContent
                }
              }

              return (
                <Timeline.Item key = { i } type = { type }>
                  <Card
                    title = { v.name }
                    type = { type }
                    data = { v.data }
                    disabled = { i > stepIndex }
                    leftContent = { leftContent }
                    rightContent = { rightContent }
                  />
                </Timeline.Item>
              )
            })
          }
        </Timeline>
      </Box>
    )
  }

  render () {
    return (
      <Fragment>
        <button onClick = { () => this.setState(prevState => ({ stepIndex: prevState.stepIndex + 1 })) }>加一个步骤</button>
        { this.renderSteps() }
        { this.renderTimeline() }
        <Modal visible = { this.state.signVisible } onClose = { () => { this.setState({ signVisible: false }) } }>
          <h2>小贴士</h2>
          <h3>网签提供材料</h3>
          <p>个人购房——购房人身份证、商品房买卖合同、预售开户银行保证金账户进账单、购房收据；</p>
          <p>企业购房——商品房买卖合同、预售开户银行保证金账户进账单、购房收据、购房企业营业执照；</p>
        </Modal>
        <Modal visible = { this.state.recordVisible } onClose = { () => { this.setState({ recordVisible: false }) } }>
          <h2>小贴士</h2>
          <h3>备案提供材料</h3>
          <p>个人购房——购房人身份证、商品房买卖合同、预售开户银行保证金账户进账单、购房收据；</p>
          <p>企业购房——商品房买卖合同、预售开户银行保证金账户进账单、购房收据、购房企业营业执照；</p>
        </Modal>
        <AntdModal
          title = '存款证明切换'
          transparent
          visible = { this.state.exchangeVisible }
          onClose = { () => { this.setState({ exchangeVisible: false }) } }
          className = { style.modal }
        >
          {
            this.state.certificate.map((v, i) => (
              <div
                className = { cs(style['exchange-box'], { [style['exchange-box-active']]: v.id === this.state.certificateId }) }
                key = { i }
                onClick = { e => this.setState({ certificateId: v.id }) }
              >
                { v.type }
                <Divider type = 'vertical' />
                { v.date }
                <Divider type = 'vertical' />
                { v.status }
                <Divider type = 'vertical' />
                { v.price }
              </div>
            ))
          }
          <div className = { style['modal-action'] }>
            <Row gutter = { 16 }>
              <Col span = { 12 }>
                <Button onClick = { e => this.setState({ exchangeVisible: false }) }>取消</Button>
              </Col>
              <Col span = { 12 }>
                <Button onClick = { e => this.setState({ exchangeVisible: false }) } type = 'primary'>确定</Button>
              </Col>
            </Row>
          </div>
        </AntdModal>
      </Fragment>
    )
  }
}