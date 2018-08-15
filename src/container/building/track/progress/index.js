import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Divider, Button } from 'antd'
import { Timeline, Box, Steps, Card } from 'component/building_detail'
import Modal from 'component/modal'
import { CertificateModal, NetSignModal } from 'component/exchangeModal'
import { success } from 'model/building'

import style from './index.less'

@withRouter
@connect(state => ({
  user: state.user,
  building: state.building
}), {
  success
})
export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      stepIndex: -1,
      // 开盘信息
      open: {},
      // 存款证明列表
      certificate: [],
      // 网签列表
      sign: [],
      // 备案列表
      record: [],
      // 房产证列表
      property: [],
      // 当前选择的存款证明
      certificateActive: 0,
      // 当前选择的网签
      signActive: 0,
      // 网签、备案、房产证当前选择的房源编号
      houseNoActive: '',
      // 切换存款证明模态框
      exchangeCVisible: false,
      // 切换网签模态框
      exchangeNVisible: false,
      // 网签提示模态框
      signVisible: false,
      // 备案提示模态框
      recordVisible: false
    }
  }

  componentDidMount () {
    const {
      certificate = [],
      open = {},
      sign = [],
      record = [],
      property = []
    } = this.props.building

    let stepIndex = -1

    // 存款证明: 完成第一步
    if (certificate.length) {
      stepIndex = 0
    }

    // 开盘信息: 完成第二步
    if (open.status === '0') {
      stepIndex = 1
    }

    // 网签信息: 完成第三步
    if (sign.length) {
      stepIndex = 2
    }

    // 备案信息: 完成第四步
    if (record.length) {
      stepIndex = 3
    }

    // 房产证信息: 完成第五步
    if (property.length) {
      stepIndex = 4
    }

    this.setState({
      open,
      stepIndex,
      certificate,
      sign,
      record,
      property,
      houseNoActive: sign.length ? sign[0].HouseId : ''
    })
  }

  handleModal = (type, e) => {
    e.preventDefault()

    this.setState({
      [type]: true
    })
  }

  handleChoiceHouse = () => {
    const { certificate, certificateActive } = this.state
    const { id } = this.props.building

    this.props.success({
      certificateId: certificate[certificateActive].idtityId
    })
    this.props.history.push(`/service/choice_house/certificate/${ id }/home`)
  }

  renderSteps = () => {
    const { auth, userType } = this.props.user
    const {
      stepIndex,
      certificate,
      open,
      sign,
      record,
      property,
    } = this.state

    return (
      <Box
        title = '购房节点'
        titleExtra = { '' }
      >
        <Steps
          index = { 4 }
          data = { [{
            type: '1',
            text: '存款证明',
            active: true
          }, {
            type: '2',
            text: '在线开盘',
            active: true
          }, {
            type: '3',
            text: '购房网签',
            active: true
          }, {
            type: '4',
            text: '购房备案',
            active: true
          }, {
            type: '5',
            text: '房产证',
            active: true
          }] }
        />
      </Box>
    )
  }

  renderTimeline = () => {
    const { auth, userType } = this.props.user

    const {
      stepIndex,
      // step,

      certificate,
      certificateActive,
      signActive,
      houseNoActive,
      sign,
      record,
      property,
      open
    } = this.state

    // 没有登录则不显示节点追踪
    if (!auth || userType === '1') {
      return (
        <div className = { style['tip-box'] }>
          <div className = { style['tip-content'] }>请挑选楼盘并至售楼处办理存款证明后使用该服务</div>
          <div className = { style['tip-action'] }>
            <Button onClick = { e => this.props.history.push('/new_building') }>挑选楼盘</Button>
          </div>
        </div>
      )
    }

    let stepString = null

    if (stepIndex > -1) {
      if (5 - stepIndex > 0) {
        stepString = <span><Divider type = 'vertical' />还差<span style = { { color: '#FF4F32' } }> { 5 - (stepIndex + 1) } </span>步完成所有节点</span>
      } else {
        stepString = <span>已完成购房</span>
      }
    }

    const certificateData = certificate[certificateActive] || {}
    const signData = sign[signActive] || {}
    const recordData = _.find(record, _v => _v.HouseId === houseNoActive) || {}
    const propertyData = _.find(property, _v => _v.HouseId === houseNoActive) || {}

    return (
      <Box bottomText = '由贵阳市房管局提供数据支持' title = '节点跟踪' titleExtra = ''>
        <Timeline>
          <TimelineBox
            title = '存款证明'
            complete = { certificate.length }
            current = { stepIndex === 0 }
            leftContent = { () => <div className = { style['card-btn'] } onClick = { e => { this.handleModal('exchangeCVisible', e) } }>切换</div> }

            data = { [{
              title: '物业类型',
              value: certificateData.name
            }, {
              title: '办理时间',
              value: certificateData.tradeDate ? moment(parseInt(certificateData.tradeDate)).format('YYYY-MM-DD') : '暂无'
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
            complete = { open.status === '0' }
            current = { stepIndex === 1 }
            // leftContent = { open.isselect === '0' ? () => <div className = { style['card-btn'] } onClick = { this.handleChoiceHouse }>去选房</div> : null }

            data = { [{
              title: '开盘时间',
              value: open.openTime ? `预计${ moment(parseInt(open.openTime)).format('YYYY-MM-DD HH:mm:ss') }` : '未知'
            }, {
              title: '开盘状态',
              value: open.status === '0' ? '已开盘' : '未开盘'
            }, {
              title: '选房资格',
              value: open.isselect === '0' ? '已具备选房资格' : '无'
            }, {
              title: '房源信息',
              value: '暂无'
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '购房网签'
            complete = { sign.length }
            current = { false }
            leftContent = { () => <div className = { style['card-btn'] } onClick = { e => { this.handleModal('exchangeNVisible', e) } }>切换</div> }

            data = { [{
              title: '房源编号',
              value: signData.HouseId ? signData.HouseId : '暂无'
            }, {
              title: '网签状态',
              value: signData.State ? signData.State : '未办理'
            }, {
              title: '网签时间',
              value: signData.RegisterDate ? signData.RegisterDate : '暂无'
            }, {
              title: '网签地址',
              value: signData.Address ? signData.Address : '暂无'
            }, {
              value: <a href = '#' onClick = { e => { this.handleModal('signVisible', e) } }>点击了解网签所需材料</a>
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '购房备案'
            complete = { Object.keys(recordData).length }
            current = { false }

            data = { [{
              title: '房源编号',
              value: recordData.HouseId ? recordData.HouseId : '暂无'
            }, {
              title: '备案状态',
              value: recordData.State ? recordData.State : '未办理'
            }, {
              title: '备案时间',
              value: recordData.RegisterDate ? recordData.RegisterDate : '暂无'
            }, {
              value: <a href = '#' onClick = { e => { this.handleModal('recordVisible', e) } }>点击了解备案可取回材料</a>
            }] }
          />
        </Timeline>
        <Timeline>
          <TimelineBox
            title = '房产证'
            complete = { Object.keys(propertyData).length }
            current = { false }

            data = { [{
              title: '房源编号',
              value: propertyData.HouseId ? propertyData.HouseId : '暂无'
            }, {
              title: '办理状态',
              value: propertyData.State ? propertyData.State : '未办理'
            }] }
          />
        </Timeline>
      </Box>
    )
  }

  render () {

    return (
      <Fragment>
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
          visible = { this.state.exchangeCVisible }
          onClose = { () => { this.setState({ exchangeCVisible: false }) } }
          onSubmit = { (i, v) => this.setState({ exchangeCVisible: false, certificateActive: i }) }
        />

        <NetSignModal
          data = { this.state.sign }
          active = { this.state.signActive }
          visible = { this.state.exchangeNVisible }
          onClose = { () => { this.setState({ exchangeNVisible: false }) } }
          onSubmit = { (i, v) => { this.setState({ exchangeNVisible: false, signActive: i, houseNoActive: v.HouseId }) } }
        />
      </Fragment>
    )
  }
}

const TimelineBox = props => {
  const {
    complete,
    current,
    leftContent,

    ...rest
  } = props

  let status     = '',
      statusText = ''

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