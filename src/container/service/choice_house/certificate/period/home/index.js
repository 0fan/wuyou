import React, { Component, Fragment } from 'react'

import Context from 'context/config'

import Image from 'component/image'
import { PeriodBox } from 'component/choice_house'

import style from './index.less'

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
        to: '/service/choice_house/certificate',
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }
  }

  handleClick = () => {
    const { period } = this.props.match.params

    this.props.history.push(`/service/choice_house/certificate/${ period }/choice_house`)
  }

  render () {
    return (
      <Fragment>
        <Banner
          title = '融创九樾府'
          src = 'http://img5.imgtn.bdimg.com/it/u=1465688531,974091168&fm=200&gp=0.jpg'
        />
        <PeriodBox>
          <PeriodBox.Box
            surplus = { 200 }
            building = '融创九樾府'
            period = '一期'
            deposit = { 5000 }
            status = '已开盘'
            type = { ['高层', '洋房'] }
            time = { '2018-06-18 19:30:00' }
            onClick = { this.handleClick }
          />
          <PeriodBox.Box
            surplus = { 11 }
            building = '融创九樾府'
            period = '一期'
            deposit = { 5000 }
            status = '已开盘'
            type = { ['高层', '洋房'] }
            time = ''
          />
          <PeriodBox.Box
            surplus = { 11 }
            building = '融创九樾府'
            period = '一期'
            deposit = { 5000 }
            status = '已开盘'
            type = { ['高层', '洋房'] }
            time = '2017-12-12 12:20'
          />
          <PeriodBox.Box
            surplus = { 11 }
            building = '融创九樾府'
            period = '一期'
            deposit = { 5000 }
            status = '已开盘'
            type = { ['高层', '洋房'] }
            time = '2018-12-12 12:20'
          />
          <PeriodBox.Box
            surplus = { 11 }
            building = '融创九樾府'
            period = '一期'
            deposit = { 5000 }
            status = '已开盘'
            type = { ['高层', '洋房'] }
            time = '2018-12-12 12:20'
            primary = { true }
            onClick = { this.handleClick }
          />
        </PeriodBox>
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

const Banner = props => {
  const {
    title,
    src
  } = props

  return (
    <div className = { style.banner }>
      <div className = { style['banner-title'] }>{ title }</div>
      <Image src = { src } />
    </div>
  )
}