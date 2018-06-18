import React, { Component, Fragment } from 'react'

import { CertificateBox } from 'component/choice_house'

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

  handleClick = id => {
    const {
      history,
      match: {
        url
      }
    } = this.props

    this.props.history.push(`/service/choice_house/certificate/${ id }`)
  }

  render () {
    return (
      <CertificateBox>
        <CertificateBox.Box
          id = { 1 }
          title = '2017年1月4日办理的存款证明'
          amount = '50000.00'
          type = '高层'
          building = '金科十年城'
          status = { 1 }
          qrcode = 'ffsdds'
          onClick = { this.handleClick }
        />
        <CertificateBox.Box
          id = { 1 }
          title = '2017年1月4日办理的存款证明'
          amount = '50000.00'
          type = '高层'
          building = '金科十年城'
          status = { 0 }
          qrcode = 'ffsdds'
        />
      </CertificateBox>
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