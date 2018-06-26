import React, { Component, Fragment } from 'react'

import { OrderBox } from 'component/choice_house'
import { Modal, Toast } from 'antd-mobile'

import Context from 'context/config'

const { alert } = Modal

class App extends Component {
  state = {
    data: [{
      id: 1,
      qrcode: 'dfsfdsf',
      title: '1栋-1单元-1101',
      deposit: 5000,
      calcType: '套内面积',
      innerPrice: 8400.00,
      innerArea: 114.00,
      total: 1188800.00,
      building: '滨江壹号院',
      period: '三期',
      type: '高层',
      room: '1101',
      openTime: '2018-06-17 22:20',
      discount: '9.8折/立减1万',
      discountTotal: 10880888.00,
      status: 0,
      visibleQrcode: false
    }]
  }

  componentDidMount () {
    const {
      match: {
        url,
        params: { id }
      },
      footerConfig,
      changeFooter
    } = this.props

    if (!footerConfig.length || footerConfig[0] && footerConfig[0].text !== '在线选房') {
      changeFooter([{
        type: 'building',
        to: `/service/choice_house/certificate/${ id }`,
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }
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
                  status: 1,
                  // 锁定完成自动打开
                  visibleQrcode: true
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
    return (
      <Fragment>
        <OrderBox>
          {
            this.state.data.map((v, i) => (
              <OrderBox.Box
                { ...v }

                onLock = { e => this.handleClick(v, i, e) }

                key = { i }
              />
            ))
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