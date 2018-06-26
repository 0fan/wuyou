import React, { Component } from 'react'
import Image from 'component/image'
import cs from 'classnames'
import moment from 'moment'
import QRCode from 'qrcode'

import Animate from 'rc-animate'
import { Button, Icon } from 'antd'

import style from './index.less'

class Box extends Component {
  constructor (props) {
    super(props)

    this.timer = null

    const { visibleQrcode = false } = props

    this.state = {
      visibleQrcode,
      qrcodeImage: '',

      time: new Date().getTime()
    }
  }

  componentDidMount () {
    this.timer = setInterval(() => {
      this.setState({
        time: new Date().getTime()
      })
    }, 1000)

    if (this.props.qrcode) {
      QRCode.toDataURL(this.props.qrcode, {
        margin: 0,
        width: 285
      }, (err, url) => {
        if (!err) {
          this.setState({
            qrcodeImage: url
          })
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.visibleQrcode !== nextProps.visibleQrcode) {
      this.setState({ visibleQrcode: nextProps.visibleQrcode })
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render () {
    const {
      title,
      deposit,
      calcType,
      innerPrice,
      innerArea,
      total,
      onClick,
      status,

      onLock = f => f,
      onPay = f => f,

      building,
      type,
      room,

      openTime,

      discount,
      discountTotal
    } = this.props

    const formatTime = moment(openTime).format('YYYY-MM-DD')

    let renderTime = `开盘时间:${ formatTime }`
    let renderAction = null
    let qrcode = null

    // 已开盘
    if (moment(openTime).isBefore(moment())) {
      qrcode = <div className = { style['box-qrcode'] } onClick = { () => this.setState({ visibleQrcode: true }) }></div>

      if (status === 0) {
        renderAction = <Button className = { style['box-action'] } type = 'primary' onClick = { onLock }>立即锁定</Button>
      }

      if (status === 1) {
        renderAction = <Button className = { style['box-action'] } type = 'primary' onClick = { onPay }>待支付</Button>
      }

    } else {
      // 是否在某个时间范围内（开盘倒计时）
      if (moment(openTime).isBetween(moment(this.state.time), moment(this.state.time).add(24, 'h'))) {
        const diff = Math.abs(new Date(this.state.time).getTime() - new Date(openTime).getTime()) / 1000

        renderTime = (
          <a href = 'javascript:;'>
            还剩
            { Math.floor(diff / 3600) }小时
            { Math.floor(diff % 3600 / 60) }分
            { Math.floor(diff % 60) }秒
            开盘
          </a>
        )

        renderAction = <Button className = { style['box-action'] }>移出预选</Button>
      }
    }

    return (
      <div className = { style.box }>
        <div className = { style['box-header'] }>
          <div className = { style['box-header-left'] }>
            { building } { type }
          </div>
          <div className = { style['box-header-right'] }>房号：{ room }</div>
        </div>
        <div className = { style['box-body'] }>
          { qrcode }
          <div className = { style['box-title'] }>{ title }</div>
          <div className = { style['box-deposit'] }>定金:￥{ deposit }</div>
          <div className = { style['box-extra'] }>
            <div className = { style['box-extra-item'] }>计价方式：{ calcType }</div>
            <div className = { style['box-extra-item'] }>套内价格：{ innerPrice }元/㎡</div>
            <div className = { style['box-extra-item'] }>房屋总价：{ total }元</div>
            <div className = { style['box-extra-item'] }>套内面积：{ innerArea }㎡</div>
            {
              discount ?
                <div className = { style['box-extra-item'] }>优惠：{ discount }</div> :
                null
            }
            {
              discountTotal ?
                <div className = { style['box-extra-item'] }>优惠后总价：{ discountTotal }元</div> :
                null
            }
          </div>
        </div>
        <div className = { style['box-footer'] }>
          <div className = { style['box-footer-left'] }>
            { renderTime }
          </div>
          <div className = { style['box-footer-right'] }>
            { renderAction }
          </div>
        </div>
        <Animate transitionName = 'slide-left'>
          {
            qrcode && this.state.visibleQrcode ?
              <div className = { style['box-mask'] }>
                <div className = { style['box-mask-qrcode-img-wrap'] }>
                  <Image src = { this.state.qrcodeImage } />
                </div>
                <div className = { style['box-mask-title'] }>请向售楼处工作人员出示付款二维码</div>
                <div className = { style['box-mask-title'] }><em>付款倒计时 1天15小时12分</em></div>
                <div className = { style['box-mask-back'] } onClick = { () => this.setState({ visibleQrcode: false }) } />
              </div> :
              null
          }
        </Animate>
      </div>
    )
  }
}

const List = props => (
  <div className = { style['list'] }>{ props.children }</div>
)

List.Box = Box

export default List