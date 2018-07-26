import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'

import Context from 'context/config'

import { Spin } from 'antd'
import Alert from 'component/alert'
import Empty from 'component/empty'
import Image from 'component/image'
import BottomText from 'component/bottom-text'
import { PeriodBox } from 'component/choice_house'

import { url, api } from 'config/api'

import { success } from 'model/building'

import style from './index.less'

const { server } = url
const { getPeriod } = api.building

@connect(state => ({
  building: state.building
}), {
  success
})
class App extends Component {
  isMount = true

  state = {
    loading: false,
    data: [],
    msg: '',
    buildName: ''
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
      this.setState({ msg: <span>{ err || '获取期数信息失败' } <a href = 'javascript:;' onClick = { () => { this.getPeriodData(id) } }>重试</a></span> })

      return [err]
    }

    const {
      object: {
        statings,
        buildName,
      } = {
        statings: [],
        buildName: '',
      }
    } = res

    this.setState({
      buildName,
      data: statings
    })

    return [null, res]
  }

  handleClick = (choiceHouseType, v) => {
    const { housePeriodId, hobPreNum } = v

    this.props.success({
      choiceHouseType,
      hobPreNum
    })

    this.props.history.push(`/service/choice_house/certificate/${ housePeriodId }/choice_house`)
  }

  handleBack = () => {
    const { id } = this.props.building
    this.props.history.push(`/building/${ id }/track/progress`)
  }

  render () {
    const { backgroundImg, type } = this.props.building
    const {
      msg,
      buildName,
      data,
      loading
    } = this.state

    return (
      <Fragment>
        <BackIcon onClick = { this.handleBack }  />
        <Alert message = { msg } fixed />
        <Banner
          title = { buildName }
          src = { backgroundImg }
        />
        <PeriodBox>
          {
            loading ?
              <BottomText><Spin /></BottomText> :
              data && data.length ?
                data.map((v, i) => (
                  <PeriodBox.Box
                    key = { i }
                    id = { v.housePeriodId }
                    surplus = { v.surpluscount }
                    period = { v.name }
                    building = { buildName }
                    // deposit = { 5000 }
                    primary = { parseInt(v.appPre) }
                    choice = { parseInt(v.hobWay) }
                    status = { parseInt(v.status) }
                    type = { [ type ] }
                    time = { v.hobSpecificTime ? moment(parseInt(v.hobSpecificTime)).format('YYYY-MM-DD') : null }
                    onClick = { (choiceHouseType) => { this.handleClick(choiceHouseType, v) } }
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
      <Image isZoom = { false } src = { src } />
    </div>
  )
}

const BackIcon = props => {
  const {
    onClick
  } = props
  return (
    <div onClick = { onClick } className = { style['back-icon'] }>
    </div>
  )
}