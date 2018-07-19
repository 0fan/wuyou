import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'

import Alert from 'component/alert'
import Empty from 'component/empty'
import { OrderBox } from 'component/choice_house'
import { Modal, Toast } from 'antd-mobile'

import { url, api } from 'config/api'

import Context from 'context/config'

const { alert } = Modal
const { server } = url
const { getMyLockList, lockPrimaryHouse, deleteHouseOrder } = api.building

@connect(state => ({
  building: state.building
}))
class App extends Component {
  isMount = true

  state = {
    msg: '',
    loading: false,
    data: []
  }

  componentDidMount () {
    const {
      match: {
        url
      },
      footerConfig,
      changeFooter,
      building: {
        id
      }
    } = this.props

    if (!footerConfig.length || footerConfig[0] && footerConfig[0].text !== '在线选房') {
      changeFooter([{
        type: 'building',
        to: `/service/choice_house/certificate/${ id }/home`,
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }

    this.getList()
  }

  componentWillUnmount () {
    this.isMount = false
  }

  getList = async () => {
    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.post(server + getMyLockList)

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: <span>{ err } <a href = 'javascript:;' onClick = { () => { this.getList() } }>重试</a></span> })

      return [err]
    }

    const {
      code,
      message,
      object
    } = res

    if (code !== 0) {
      this.setState({ msg: <span>{ err } <a href = 'javascript:;' onClick = { () => { this.getList() } }>重试</a></span> })

      return [message || '获取我的房源列表失败']
    }

    this.setState({
      data: object
    })

    console.log(this.state.data)

    return [null, res]
  }

  handleLock = (v) => {
    const { houseOrderId, excelRoomStr } = v

    const a = alert(<span>锁定<span style = { { color: '#F41906' } }>{ v.title }</span></span>, <span>确定锁定{ excelRoomStr }吗?</span>, [{
      text: '再考虑下'
    }, {
      text: '我确定',
      onPress: async () => {
        Toast.loading('锁定中...', 0, null, true)

        const [err, res] = await axios.post(server + lockPrimaryHouse, { houseOrderId })

        Toast.hide()

        if (!this.isMount) {
          return
        }

        this.setState({ loading: false })

        if (err) {
          Toast.fail('锁定失败', 2, null, false)

          return [err]
        }

        const {
          code,
          message
        } = res

        if (code !== 0) {
          Toast.fail(message || '业务流程异常未锁定成功', 2, null, false)

          return [message || '业务流程异常未锁定成功']
        }

        Toast.success('锁定成功', 1, () => {
          this.getList()
        }, false)

        return [null, res]
      }
    }])
  }

  handleRemove = (v) => {
    const { houseOrderId, excelRoomStr } = v

    const a = alert(<span>移除<span style = { { color: '#F41906' } }>{ v.title }</span></span>, <span>确定移除{ excelRoomStr }吗?</span>, [{
      text: '再考虑下'
    }, {
      text: '我确定',
      onPress: async () => {
        Toast.loading('移除中...', 0, null, true)

        const [err, res] = await axios.post(server + lockPrimaryHouse, { houseOrderId })

        Toast.hide()

        if (!this.isMount) {
          return
        }

        this.setState({ loading: false })

        if (err) {
          Toast.fail('移除失败', 2, null, false)

          return [err]
        }

        const {
          code,
          message
        } = res

        if (code !== 0) {
          Toast.fail(message || '业务流程异常未移除成功', 2, null, false)

          return [message || '业务流程异常未移除成功']
        }

        Toast.success('移除成功', 1, () => {
          this.getList()
        }, false)

        return [null, res]
      }
    }])
  }

  render () {
    const { msg, data } = this.state

    return (
      <Fragment>
        <Alert message = { msg } fixed />
        <OrderBox>
          {
            data.length ?
              data.map((v, i) => (
                <OrderBox.Box
                  id = { v.houseOrderId }
                  qrcode = { v.houseOrderId + '&ypf' }
                  title = { v.excelRoomStr }
                  deposit = { v.tradeAmount }
                  calcType = { v.priceWay }
                  innerPrice = { v.setInPrice }
                  innerArea = { v.setInArea }
                  total = { v.hTotalPrice }
                  building = { v.buildingName }
                  type = { v.name }
                  // room = {}
                  openTime = { v.hobSpecificTime ? moment(parseInt(v.hobSpecificTime)).format('YYYY-MM-DD HH:mm:ss') : '待定' }
                  systemTime = { parseInt(v.systemTime) }
                  deadTime = { parseInt(v.deadTime) }
                  discount = { v.discountWay }
                  discountTotal = { v.discountTotalPrice }
                  // 按钮状态判断相关
                  houseOrderType = { parseInt(v.houseOrderType) }
                  openStatus = { parseInt(v.periodStatus) }
                  payStatus = { parseInt(v.payStatus) }

                  onLock = { () => this.handleLock(v) }
                  onRemove = { () => this.handleRemove(v) }

                  key = { i }
                />
              )) :
              <Empty text = '没有房源数据' />
          }
        </OrderBox>
      </Fragment>
    )
  }
}

export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)