import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import Alert from 'component/alert'
import Image from 'component/image'
import BottomText from 'component/bottom-text'
import Empty from 'component/empty'

import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { getHouseList } = api.i

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  isMount = true

  constructor (props) {
    super(props)

    this.state = {
      data: [],
      msg: '',
      loading: false
    }
  }

  componentDidMount () {
    if (this.props.user.auth) {
      this.getHouse()
    }
  }

  componentWillUnmount () {
    this.isMount = false
  }

  getHouse = async () => {
    this.setState({ loading: true })

    const [err, res] = await axios.post(server + getHouseList)

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: err })

      return [err]
    }

    const {
      returnBuildings = []
    } = res.object

    this.setState({
      data: returnBuildings.map(v => ({
        id: v.id,
        img: v.backgroundImg,
        title: v.originalName,
        tag: v.buildingTag ? v.buildingTag.split(',').filter(v => v) : [],
        news: v.renews && v.renews.length ? { text: v.renews[0].content, link: `/building/${ v.id }/detail/dynamic` } : null,
        referencePrice: v.amountArray,
        owner: v.ownerNum,
        hot: v.hot,
        to: `/building/${ v.id }`
      }))
    })

    return [null, res.object]
  }

  handleClick = (v, i, e) => {
    this.props.history.push(`/building/${ v.id }`)
  }

  render () {
    const {
      user: {
        auth
      }
    } = this.props

    const {
      data,
      msg,
      loading
    } = this.state

    return (
      <Fragment>
        <Alert message = { msg } />
        <List
          data = { data }
          headerContent = { !loading && data.length ? <div>共绑定{ data.length }个楼盘</div> : null }
          footerContent = {
            !auth ?
              <Empty text = '没有登录,登录后可查看我的房屋信息' /> :
              loading ?
                <BottomText><Spin /></BottomText> :
                !data.length ?
                  <Empty text = '没有绑定的楼盘' /> :
                  <BottomText>没有更多</BottomText>
          }

          onClick = { this.handleClick }
        />
      </Fragment>
    )
  }
}

const List = props => {
  const {
    data = [],

    headerContent,
    footerContent,

    children,

    onClick,

    ...rest
  } = props

  return (
    <div className = { style['list-wrap'] }>
      {
        headerContent ?
          <div className = { style['list-header'] }>{ headerContent }</div> :
          null
      }
      <div className = { style['list-body'] }>
        {
          data.map((v, i) => (
            <List.Item
              { ...v }

              onClick = { e => { onClick(v, i, e) } }

              key = { i }
            />
          ))
        }
      </div>
      {
        footerContent ?
          <div className = { style['list-footer'] }>{ footerContent }</div> :
          null
      }
    </div>
  )
}

List.Item = props => {
  const {
    title,
    tag = [],
    news,
    referencePrice,
    owner,
    hot,
    img,
    onClick,

    childre,

    ...rest
  } = props

  return (
    <div className = { style['item'] } onClick = { onClick }>
      <div className = { style['item-inner'] }>
        <div className = { style['item-body'] }>
          <div className = { style['item-title'] }>{ title }</div>
          <div className = { style['item-tag'] }>
            {
              tag.map((v, i) => (
                <div className = { style['item-tag-item'] } key = { i }>{ v }</div>
              ))
            }
          </div>
          {
            news ?
              <Link onClick = { e => e.stopPropagation() } to = { news.link } className = { style['item-news'] }>
                <div className = { style['item-news-text'] }>{ news.text }</div>
              </Link> :
              null
          }
        </div>
        <div className = { style['item-footer'] }>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>参考价格</div>
            <div className = { style['item-footer-item-value'] }>{ _.isNil(referencePrice) ? '未知' : referencePrice }</div>
          </div>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>业主人数</div>
            <div className = { style['item-footer-item-value'] }>{ owner }</div>
          </div>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>楼盘热度</div>
            <div className = { style['item-footer-item-value'] }>{ hot }°</div>
          </div>
        </div>
      </div>
      <div className = { style['item-bg'] }>
        <Image
          src = {
            !img || _.isNil(img) ?
              require('./img/placeholder.jpg') :
              img
          }
        />
      </div>
    </div>
  )
}