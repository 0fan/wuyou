import React, { Component, Fragment } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import cs from 'classnames'
import { connect } from 'react-redux'

import { Divider, Button, Row, Col } from 'antd'
import { Modal as AntdModal, Toast } from 'antd-mobile'
import { Timeline, Box, Steps, Card } from 'component/building_detail'
import Modal from 'component/modal'

import style from './index.less'

@withRouter
@connect(state => ({
  user: state.user,
  building: state.building
}), {})
export default class App extends Component {
  constructor (props) {
    super(props)

    const {
      certificate = [],
      open = {}
    } = props.building

    let stepIndex = -1

    // 如果有存款证明则表示第一步完成啦
    if (certificate && certificate.length) {
      stepIndex = 0
    }

    // 如果有开盘信息则表示第二步完成啦
    if (Object.keys(open).length) {
      stepIndex = 1
    }

    this.state = {
      stepIndex,

      // 存款证明列表
      certificate,
      // 当前选择的存款证明id
      certificateActive: 0,

      open,

      // 切换存款证明模态框
      exchangeVisible: false,
      // 网签提示模态框
      signVisible: false,
      // 备案提示模态框
      recordVisible: false
    }
  }

  handleModal = (type, e) => {
    e.preventDefault()

    this.setState({
      [type]: true
    })
  }

  renderSteps = () => {
    const { auth, userType } = this.props.user
    const { stepIndex, step } = this.state

    return (
      <Box
        title = '购房节点'
        titleExtra = { '' }
      >
        <Steps
          index = {
            auth && userType === '0' ?
              this.state.stepIndex :
              -1
          }
          data = { [{
            type: '1',
            text: '存款证明'
          }, {
            type: '2',
            text: '在线开盘'
          }, {
            type: '3',
            text: '购房网签'
          }, {
            type: '4',
            text: '购房备案'
          }, {
            type: '5',
            text: '房产证'
          }] }
        />
      </Box>
    )
  }

  renderTimeline = () => {
    const { id } = this.props.building
    const { auth } = this.props.user

    const {
      stepIndex,
      // step,

      certificate,
      certificateActive,

      open
    } = this.state

    // 没有登录则不显示节点追踪
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

    let stepString = null

    if (stepIndex > -1) {
      if (5 - stepIndex > 0) {
        stepString = <span><Divider type = 'vertical' />还差<span style = { { color: '#F41906' } }> { 5 - stepIndex } </span>步完成所有节点</span>
      } else {
        stepString = <span>已完成购房</span>
      }
    }

    const certificateData = certificate[certificateActive] || {}

    return (
      <Box title = '节点跟踪' titleExtra = { stepString }>
        <Timeline>
          <TimelineBox
            title = '存款证明'
            complete = { certificate.length }
            current = { stepIndex === 0 }
            leftContent = { () => <div className = { style['card-btn'] } onClick = { e => { this.handleModal('exchangeVisible', e) } }>切换</div> }

            data = { [{
              title: '物业类型',
              value: certificateData.name
            }, {
              title: '办理时间',
              value: moment(certificateData.tradeDate).format('YYYY-MM-DD')
            }, {
              title: '办理状态',
              value: '成功办理'
            }, {
              title: '存款金额',
              value: certificateData.tradeAmount
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '在线开盘'
            complete = { open.openTime }
            current = { stepIndex === 1 }
            leftContent = { open.openTime && open.status === '1' ? () => <div className = { style['card-btn'] } onClick = { e => { this.props.history.push(`/service/choice_house/certificate/${ id }/home`) } }>去选房</div> : null }

            data = { [{
              title: '预计开盘时间',
              value: open.openTime
            }, {
              title: '开盘状态',
              value: open.openTime ? moment(open.openTime).format('YYYY-MM-DD') : '未知'
            }, {
              title: '选房资格',
              value: open.isselect === '1' ? '已具备选房资格' : '无'
            }, {
              title: '房源信息',
              value: '暂无'
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '购房网签'
            complete = { false }
            current = { open.openTime && stepIndex === 1 }

            data = { [{
              title: '预计开盘时间',
              value: open.openTime
            }, {
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
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '购房备案'
            complete = { false }
            current = { stepIndex === 3 }

            data = { [{
              title: '备案状态',
              value: '未办理'
            }, {
              title: '备案时间',
              value: '暂无'
            }, {
              value: <a href = '#' onClick = { e => { this.handleModal('recordVisible', e) } }>点击了解备案可取回材料</a>
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '房产证'
            complete = { false }
            current = { stepIndex === 4 }

            data = { [{
              title: '办理状态',
              value: '未办理'
            }] }
          />
        </Timeline>
      </Box>
    )
  }

  render () {

    return (
      <Fragment>
        {/* <button onClick = { () => this.setState(prevState => ({ stepIndex: prevState.stepIndex + 1 })) }>加一个步骤</button> */}
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
          <h3>备案可取回材料</h3>
          <p>涉税表</p>
          <p>备案证明</p>
          <p>个人住房信息查询表</p>
        </Modal>

        <CertificateModal
          data = { this.state.certificate }
          active = { this.state.certificateActive }

          visible = { this.state.exchangeVisible }

          onClose = { () => { this.setState({ exchangeVisible: false }) } }
          onSubmit = { (i, v) => { this.setState({ exchangeVisible: false, certificateActive: i }) } }
        />
      </Fragment>
    )
  }
}

class CertificateModal extends Component {
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

// { this.renderTimeline() }

const TimelineBox = props => {
  const {
    complete,
    current,
    leftContent,

    ...rest
  } = props

  let status = ''
  let statusText = ''

  if (complete) {
    status = 'complete'
    statusText = '已完成'
  } else if (current) {
    status = 'current'
    statusText = '进行中'
  }

  return (
    <Timeline.Item type = { status }>
      <Card
        type = { status }

        leftContent = { status ? leftContent : null }

        rightContent = {
          statusText ? () => <span className = { style['card-complete'] }>{ statusText }</span> : null
        }

        { ...rest }
      />
    </Timeline.Item>
  )
}