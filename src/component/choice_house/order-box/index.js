import React, { Component, Fragment } from 'react'
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

    this.state = {
      visibleQrcode: false,
      qrcodeImage: '',

      dead: false,    // 判断倒计时是否结束  待支付 => 已失效
      systemTime: new Date().getTime(),
      deadTimeText: ''
    }
  }

  componentDidMount () {
    const { openStatus, payStatus, systemTime, deadTime, qrcode } = this.props

    this.setState({
      systemTime
    })

    if (openStatus === 0 && payStatus === 0) {
      this.timer = setInterval(() => {
        let { systemTime } = this.state,
            diff = (deadTime - this.state.systemTime) / 1000

        console.log('systemTime:' + moment(systemTime).format('YYYY-MM-DD HH:mm:ss'))
        console.log('deadTime:' + moment(deadTime).format('YYYY-MM-DD HH:mm:ss'))

        if (deadTime <= systemTime || !deadTime) {
          this.setState({
            dead: true
          })
          clearInterval(this.timer)
          this.timer = null
        }

        this.setState({
          systemTime: systemTime + 1000,
          deadTimeText: `
            ${ Math.floor(diff / (3600 * 24)) }天
            ${ Math.floor(diff / 3600) }小时
            ${ Math.floor(diff % 3600 / 60) }分
            ${ Math.floor(diff % 60) }秒`
        })
      }, 1000)
    }

    if (openStatus === 0 && payStatus === 8) {
      this.setState({
        dead: true
      })
    }

    if (qrcode) {
      QRCode.toDataURL(qrcode, {
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

  componentWillUnmount () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render () {
    const {
      id,
      title,
      deposit,
      calcType,
      innerPrice,
      innerArea,
      total,
      houseOrderType,
      onClick,
      openStatus,
      payStatus,

      onLock = f => f,
      onRemove = f => f,

      building,
      type,
      room,

      openTime,
      deadTime,
      systemTime,

      discount,
      discountTotal
    } = this.props

    let renderTime   = `开盘时间: ${ openTime }`,
        renderAction = null,
        qrcode       = null

    if (openStatus === 0 && houseOrderType === 2) {
      renderAction = <Button className = { style['box-action'] } type = 'primary' onClick = { onLock }>立即锁定</Button>
    }

    if (openStatus === 0 && payStatus === 0) {
      renderAction = this.state.dead ?
        <Button className = { style['box-action'] } type = 'primary' disabled>已失效</Button> :
        <Button className = { style['box-action'] } type = 'primary' disabled>已支付</Button>
      qrcode       = <div className = { style['box-qrcode'] } onClick = { () => this.setState({ visibleQrcode: true }) }> </div>
    }

    if (openStatus === 0 && payStatus === 1) {
      renderAction = <Button className = { style['box-action'] } type = 'primary' disabled>已支付</Button>
    }

    if (openStatus === 0 && payStatus === 8) {
      renderAction = <Button className = { style['box-action'] } type = 'primary' disabled>已失效</Button>
      qrcode       = <div className = { style['box-qrcode'] } onClick = { () => this.setState({ visibleQrcode: true }) }> </div>
    }

    if (openStatus === 1 && houseOrderType === 2) {
      renderAction = <Button className = { style['box-action'] } type = 'primary' onClick = { onRemove }>移除预选</Button>
    }

    // 已开盘
    if (openStatus === 0) {
      renderTime = `${ openTime } 已开盘`
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
          <div className = { style['box-deposit'] }>
            {
              houseOrderType === 1 ? `定金: ￥ ${ deposit }` : null
            }
          </div>
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
                  <Image isZoom = { false } src = { this.state.qrcodeImage } />
                </div>
                {
                  this.state.dead ?
                    <div className = { style['box-mask-title'] }>已失效</div> :
                    <Fragment>
                      <div className = { style['box-mask-title'] }>请向售楼处工作人员出示付款二维码</div>
                      <div className = { style['box-mask-title'] }><em>付款倒计时 <a href = 'javascript:;'>{ this.state.deadTimeText }</a></em></div>
                    </Fragment>
                }
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