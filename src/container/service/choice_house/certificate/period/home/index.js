import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'

import Context from 'context/config'

import Alert from 'component/alert'
import Empty from 'component/empty'
import Image from 'component/image'
import { PeriodBox } from 'component/choice_house'

import { url, api } from 'config/api'

import { changeChoiceHouseType } from 'model/building'

import style from './index.less'

const { server } = url
const { getPeriod } = api.building

@connect(state => ({
  building: state.building
}), {
  changeChoiceHouseType
})
class App extends Component {
  isMount = true

  state = {
    loading: false,
    data: [],
    msg: '',
    buildName: '',
    propertyType: ''
  }

  componentDidMount () {
    const {
      match: {
        url,
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

    this.getPeriodData(id)
  }

  componentWillUnmount () {
    this.isMount = false
  }

  getPeriodData = async (id) => {
    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.post(server + getPeriod, { id })

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: <span>{ err } <a href = 'javascript:;' onClick = { () => { this.getPeriodData(id) } }>重试</a></span> })

      return [err]
    }

    const {
      code,
      message,
      object: {
        statings,
        propertyType,
        buildName,
      } = {
        statings: [],
        propertyType: '',
        buildName: '',
      }
    } = res

    if (code !== 0) {
      this.setState({ msg: <span>{ err } <a href = 'javascript:;' onClick = { () => { this.getPeriodData(id) } }>重试</a></span> })

      return [message || '获取期数信息失败']
    }

    this.setState({
      propertyType: propertyType,
      buildName: buildName,
      data: statings
    })

    console.log(statings)

    return [null, res]
  }

  handleClick = (periodId, choiceType) => {
    this.props.changeChoiceHouseType(choiceType)
    this.props.history.push(`/service/choice_house/certificate/${ periodId }/choice_house`)
  }

  render () {
    const { backgroundImg } = this.props.building
    const {
      msg,
      buildName,
      propertyType,
      data
    } = this.state

    return (
      <Fragment>
        <Alert message = { msg } fixed />
        <Banner
          title = { buildName }
          src = { backgroundImg }
        />
        <PeriodBox>
          {
            data.length ?
              data.map((v, i) => (
                <PeriodBox.Box
                  key = { i }
                  id = { v.housePeriodId }
                  surplus = { v.surpluscount }
                  building = { buildName }
                  primary = { parseInt(v.appPre) }
                  choice = { parseInt(v.hobWay) }
                  period = { v.name }
                  deposit = { 5000 }
                  status = { parseInt(v.status) }
                  type = { [ propertyType ] }
                  time = { v.hobSpecificTime ? moment(parseInt(v.hobSpecificTime)).format('YYYY-MM-DD') : null }
                  onClick = { this.handleClick }
                /> )) :
              <Empty text = '没有分期数据' />
          }
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

// {
//   this.state.data.length ?
//     this.state.data.map((v, i) => (
//       <PeriodBox.Box
//         surplus = { 11 }
//         building = '融创九樾府'
//         period = '一期'
//         deposit = { 5000 }
//         status = '已开盘'
//         type = { ['高层', '洋房'] }
//         time = ''

//         key = { i }
//       />
//     )) :
//     <Empty text = '没有分期数据' />
// }
// <PeriodBox.Box
//   surplus = { 11 }
//   building = '融创九樾府'
//   period = '一期'
//   deposit = { 5000 }
//   status = '已开盘'
//   type = { ['高层', '洋房'] }
//   time = '2018-12-12 12:20'
// />
// <PeriodBox.Box
//   surplus = { 11 }
//   building = '融创九樾府'
//   period = '一期'
//   deposit = { 5000 }
//   status = '已开盘'
//   type = { ['高层', '洋房'] }
//   time = '2018-12-12 12:20'
//   primary = { true }
//   onClick = { this.handleClick }
// />