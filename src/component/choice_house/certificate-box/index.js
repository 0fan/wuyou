import React, { Component } from 'react'
import cs from 'classnames'
import moment from 'moment'
import QRCode from 'qrcode'

import Animate from 'rc-animate'
import Image from 'component/image'

import style from './index.less'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visibleQrcode: false,
      qrcodeImage: ''
    }
  }

  componentDidMount () {
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

  render () {
    const {
      id,
      // 存款证明办理时间
      time,
      // 金额
      amount,
      // 类型
      type,
      // 楼盘名称
      building,

      // 二维码内容
      qrcode,

      // 状态
      // 0 : 暂不支持
      // 1 : 选择房源
      status = 0,

      onClick = f => f
    } = this.props

    return (
      <div className = { style['box'] }>
        <div className = { style['box-inner'] }>
          <div className = { style['box-inner-time'] }>{ moment(time).format('YYYY年MM月DD日') }办理的存款证明</div>
          <div className = { style['box-inner-amount'] }><em>{ amount }</em>元</div>
          <div className = { style['box-inner-extra'] }>{ type }</div>
          <div className = { style['box-inner-extra'] }>{ building }</div>
          {
            status === 1 ?
              <div className = { style['box-inner-action'] } onClick = { () => onClick(id) }>选择房源</div> :
              <div className = { cs(style['box-inner-action'], style['box-inner-action-disabled']) }>暂不支持</div>
          }
          {
            qrcode ?
              <div className = { style['box-inner-qrcode'] } onClick = { () => this.setState({ visibleQrcode: true }) }></div> :
              null
          }
        </div>
        <Animate transitionName = 'slide-left'>
          {
            qrcode && this.state.visibleQrcode ?
              <div className = { style['box-qrcode'] }>
                <div className = { style['box-qrcode-img-wrap'] }>
                  <Image src = { this.state.qrcodeImage } />
                </div>
                <div className = { style['box-qrcode-title'] }>请向售楼处工作人员出示付款二维码</div>
                <div className = { style['box-qrcode-back'] } onClick = { () => this.setState({ visibleQrcode: false }) }></div>
              </div> :
              null
          }
        </Animate>
      </div>
    )
  }
}

const List = props => (
  <div className = { style.list }>{ props.children }</div>
)

List.Box = App

export default List