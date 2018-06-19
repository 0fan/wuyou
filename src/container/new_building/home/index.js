import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import cs from 'classnames'

import { Icon, Spin } from 'antd'
import { Carousel as AntCarousel, Toast } from 'antd-mobile'
import Image from 'component/image'
import BottomText from 'component/bottom-text'
import Sort from 'component/sort'
import HouseList from 'component/house-list'
import HouseInlineList from 'component/house-inline-list'

import { url, api } from 'config/api'

import wait from 'util/wait'

import style from './index.less'

const { server } = url
const {
  getFlash,
  getNewBuildingList,
  getBuildingList
} = api.new_building

const getData = count => (
  Array(count).fill({
    id: 1,
    imgUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=360869140,1895507837&fm=27&gp=0.jpg',
    buildingName: '融创九樾府融创九樾府融创九樾府融创九樾府',
    buildingTag: '高层,品牌地产',
    area: '南明区',
    amount: 20300
  })
)

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  state = {
    flash: [],

    newBuilding: {},

    building: [],
    buildingFilter: {
      buildingName: '',
      area: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      layOut: '',
      currentPage: 1,
    },
    buildingLoding: true,

    isEnd: false
  }

  componentDidMount () {
    this.$content = document.getElementById('content')

    this.getFlash()
    this.getNewBuilding()
    this.getBuilding()

    this.$content.addEventListener('scroll', this.handleSrcoll)
  }

  componentWillUnmount () {
    this.$content.removeEventListener('srcoll', this.handleSrcoll)
  }

  // 滚动到底部拉去数据
  handleSrcoll = _.throttle(async e => {
    const { buildingLoding, isEnd } = this.state

    if (isEnd || buildingLoding) {
      return
    }

    const {
      clientHeight,
      scrollTop,
      scrollHeight
    } = e.target

    if (clientHeight + scrollTop >= scrollHeight) {
      await this.getBuilding()
    }
  }, 100)

  // 获取轮播图
  getFlash = async () => {
    const [err, res] = await axios.get(server + getFlash)

    if (err) {
      return [err]
    }

    this.setState({
      flash: res.object.map(v => ({
        src: this.getLink(v.imgPath),
        title: v.title,
        href: this.getLink(v.buttonLinkHref),
      }))
    })

    return [null, res]
  }

  // 获取新开楼盘
  getNewBuilding = async () => {
    const [err, res] = await axios.get(server + getNewBuildingList)

    if (err) {
      return [err]
    }

    this.setState({
      newBuilding: res.object || {}
    })

    return [null, res]
  }

  // 获取楼盘列表
  getBuilding = async () => {
    const { buildingFilter } = this.state

    this.setState({ buildingLoding: true })

    const [err, res] = await axios.post(server + getBuildingList, buildingFilter)

    this.setState({ buildingLoding: false })

    if (err) {
      return [err]
    }

    const { object = [] } = res

    this.setState(prevState => ({
      building: prevState.building.concat(object),
      isEnd: object.length < 5,

      buildingFilter: {
        ...prevState.buildingFilter,
        currentPage: prevState.buildingFilter.currentPage + 1
      }
    }))

    return [null, res]
  }

  getLink = v => {
    if (!v) {
      return ''
    }

    return (
      /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(v) ?
        v :
        server + v
    )
  }

  render () {
    let bottomText = ''

    const {
      buildingLoding,
      isEnd,
      building
    } = this.state

    if (buildingLoding) {
      bottomText = <Spin />
    } else {
      if (building.length <= 0) {
        bottomText = '没有数据'
      } else if (isEnd) {
        bottomText = '到底啦'
      }
    }

    return (
      <Fragment>
        <Carousel
          data = { this.state.flash }
        />
        <Tabs
          title = '新开楼盘'
          tabs = { Object.keys(this.state.newBuilding) }
        >
          {
            Object.keys(this.state.newBuilding).map((key, i) => (
              <HouseInlineList key = { i }>
                {
                  this.state.newBuilding[key].map((v, _i) => (
                    <HouseInlineList.Item
                      title = { v.buildingName }
                      area = { v.area }
                      price = { `均价${ v.amount }元/平` }
                      key = { _i }
                      to = { `/building/${ v.id }` }
                    />
                  ))
                }
              </HouseInlineList>
            ))
          }
        </Tabs>
        <Sort />
        <HouseList>
          {
            this.state.building.map((v, i) => (
              <HouseList.Item
                src = { v.imgUrl }
                title = { v.buildingName }
                area = { v.area }
                tag = { v.buildingTag ? v.buildingTag.split(',') : [] }
                price = { `均价${ v.amount }元/平` }
                to = { `/building/${ v.id }` }

                key = { i }
              />
            ))
          }
        </HouseList>
        <BottomText>{ bottomText }</BottomText>
        <Search />
      </Fragment>
    )
  }
}

const Carousel = props => {
  const {
    data = [],

    ...rest
  } = props

  return (
    <div className = { style.carousel }>
      <AntCarousel
        infinite

        { ...rest }
      >
        {
          data.map((v, i) => (
            <div className = { style['carousel-item'] } key = { i }>
              <Image height = { 160 } src = { v.src } />
            </div>
          ))
        }
      </AntCarousel>
    </div>
  )
}

class Tabs extends Component {
  constructor (props) {
    super(props)

    const {
      defaultInit = 0,
      tabs = []
    } = props

    this.state = {
      tabs,
      index: defaultInit
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.tabs) {
      this.setState({ tabs: nextProps.tabs })
    }
  }

  render () {
    const {
      title,
      children = []
    } = this.props

    const renderChildren = children.filter((v, i) => i === this.state.index) || null

    return (
      <div className = { style['new'] }>
        <div className = { style['new-header'] }>{ title }</div>
        <div className = { style['new-body'] }>
          <div className = { style['new-filter-wrap'] }>
            <div className = { style['new-filter'] }>
              {
                this.state.tabs.map((v, i) => (
                  <div key = { i } className = { cs(style['new-filter-item'], { [style['new-filter-item-active']]: i === this.state.index }) } onClick = { e => { this.setState({ index: i }) } }>{ v }</div>
                ))
              }
            </div>
          </div>
          { renderChildren }
        </div>
      </div>
    )
  }
}

const Search = props => (
  <Link to = '/new_building/search' className = { style.search } { ...props }>
    <Icon type = 'search' />
  </Link>
)