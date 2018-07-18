import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import Alert from 'component/alert'
import Empty from 'component/empty'
import { OrderBox } from 'component/choice_house'
import { Modal, Toast } from 'antd-mobile'

import { url, api } from 'config/api'

import Context from 'context/config'

const { alert } = Modal
const { server } = url
const { getMyLockList } = api.building

@connect(state => ({
  building: state.building
}))
class App extends Component {
  isMount = true

  state = {
    msg: '',
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

  handleClick = (v, i, e) => {
    const a = alert(<span>锁定<span style = { { color: '#F41906' } }>{ v.title }</span></span>, <span>确定锁定{ v.building + v.period + v.title }吗?</span>, [{
      text: '再考虑下'
    }, {
      text: '我确定',
      onPress: async () => {
        Toast.loading('锁定中...', 0, null, true)

        setTimeout(() => {
          Toast.hide()

          this.setState(prevState => ({
            data: prevState.data.map(_v => {
              if (_v.id === v.id) {
                return {
                  ..._v,

                  openTime: '2018-06-24 22:20',
                  status: 1
                }
              }

              return { ..._v }
            })
          }))

          Toast.success('锁定成功', 3, null, false)
        }, 1000)
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
                  qrcode = ''
                  title = { v.excelRoomStr }
                  deposit = { v.tradeAmount }
                  calcType = { v.priceWay }
                  innerPrice = { v.setInPrice }
                  innerArea = { v.setInArea }
                  total = { v.hTotalPrice }
                  // building = {}
                  // period = {}
                  type = { v.name }
                  // room = {}
                  openTime = { v.hobSpecificTime }
                  // discount = {}
                  // discountTotal = {}
                  status = { v.status }

                  onLock = { e => this.handleClick(v, i, e) }

                  key = { i }
                />
              )) :
              <Empty text = '没有分期数据' />
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