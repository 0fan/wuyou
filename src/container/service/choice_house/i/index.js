import React, { Component, Fragment } from 'react'

import { OrderBox } from 'component/choice_house'

import Context from 'context/config'

class App extends Component {
  componentDidMount () {
    const {
      match: {
        url
      },
      footerConfig,
      changeFooter
    } = this.props

    if (!footerConfig.length || footerConfig[0] && footerConfig[0].text !== '在线选房') {
      changeFooter([{
        type: 'building',
        to: '/service/choice_house/certificate/home',
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }
  }
  render () {
    return (
      <Fragment>
        <OrderBox>
          <OrderBox.Box
            qrcode = 'dfsfdsf'
            title = '一期-1栋-1单元-1101'
            deposit = { 5000 }
            calcType = '套内面积'
            innerPrice = { 8400.00 }
            innerArea = { 114.00 }
            total = { 1188800.00 }
            building = '融创九樾府'
            type = '高层'
            room = '1101'
            openTime = '2018-06-17 22:20'
            discount = '9.8折/立减1万'
            discountTotal = { 10880888.00 }
          />
          <OrderBox.Box
            qrcode = 'dfsfdsf'
            title = '一期-1栋-1单元-1101'
            deposit = { 5000 }
            calcType = '套内面积'
            innerPrice = { 8400.00 }
            innerArea = { 114.00 }
            total = { 1188800.00 }
            building = '融创九樾府'
            type = '高层'
            room = '1101'
            openTime = '2018-06-18 22:20'
            discount = '9.8折/立减1万'
            discountTotal = { 10880888.00 }
          />
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