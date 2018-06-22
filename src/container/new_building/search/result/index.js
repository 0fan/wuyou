import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'

import { Spin } from 'antd'
import Sort from 'component/sort'
import Search from 'component/search'
import HouseList from 'component/house-list'
import Empty from 'component/empty'
import BottomText from 'component/bottom-text'

import { url, api } from 'config/api'

const { server } = url
const { getBuildingList } = api.new_building
const { building_filter } = api.dict

export default class App extends Component {
  constructor (props) {
    super(props)

    const value = props.match.params.word

    this.state = {
      data: [],

      filter: {
        buildingName: value ? window.decodeURI(value) : '',
        area: '',
        type: '',
        // omit
        price: '',
        minPrice: '',
        maxPrice: '',
        layOut: '',
        currentPage: 1,
      },
      filterData: [],
      loading: true,
      isEnd: false
    }
  }

  componentDidMount () {
    this.$content = document.getElementById('content')

    this.getBuilding()
    this.getFilter()

    this.$content.addEventListener('scroll', this.handleSrcoll)
  }

  componentWillUnmount () {
    this.$content.removeEventListener('srcoll', this.handleSrcoll)
  }

  // 滚动到底部拉去数据
  handleSrcoll = _.throttle(async e => {
    const { loading, isEnd } = this.state

    if (isEnd || loading) {
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

  // 获取楼盘列表
  getBuilding = async (isFilter) => {
    // 需要把筛选条件处理一下
    const {
      price = '',
      ...rest
    } = this.state.filter

    let minPrice = ''
    let maxPrice = ''

    // 魔性的处理
    if (/以上$/g.test(price)) {
      minPrice = parseFloat(price)
    } else if (/以下$/g.test(price)) {
      maxPrice = parseFloat(price)
    } else {
      const range = price.split('-').filter(v => v.length)

      if (range.length) {
        minPrice = parseFloat(range[0])
        maxPrice = parseFloat(range[1])
      }
    }

    this.setState({ loading: true })

    const [err, res] = await axios.post(server + getBuildingList, {
      ...rest,

      minPrice,
      maxPrice
    })

    this.setState({ loading: false })

    if (err) {
      return [err]
    }

    const { object = [] } = res

    this.setState(prevState => ({
      // 从筛选来请求的数据要重新开始,页码也要重置
      data: isFilter ? object : prevState.data.concat(object),
      isEnd: object.length < 5,

      filter: {
        ...prevState.filter,
        currentPage: isFilter ? 1 : prevState.filter.currentPage + 1
      }
    }))

    return [null, res]
  }

  // 获取楼盘筛选数据
  getFilter = async () => {
    const [err, res] = await axios.get(server + building_filter)

    if (err) {
      return [err]
    }

    const { object } = res

    const keys = Object.keys(object)

    let data = {}

    keys.forEach((key, i) => {
      let label = ''

      switch (key) {
        case 'area':
          label = '区域'
          break
        case 'layOut':
          label = '户型'
          break
        case 'price':
          label = '价格'
          break
        case 'type':
          label = '类型'
          break
      }

      data[key] = [{
        label: `不限${ label }`,
        value: ''
      }]
    })

    keys.map((key, i) => {
      object[key].map((_v, _i) => {
        data[key].push({
          value: _v,
          label: _v
        })
      })
    })

    this.setState({
      filterData: data
    })

    return [null, res.object]
  }

  handleChange = v => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        buildingName: v,
        currentPage: 1
      }
    }), () => {
      this.getBuilding(true)
    })
  }

  handleFilterChange = _.debounce(v => {
    // 不重复获取数据
    if (!_.isEqual(v, this.state.filter)) {
      this.setState({
        filter: {
          ...v,
          currentPage: 1
        },
      }, () => {
        // 触发筛选啦
        this.getBuilding(true)
      })
    }
  }, 500)

  render () {
    let bottomText = ''

    const {
      loading,
      isEnd,
      data
    } = this.state

    if (loading) {
      bottomText = <BottomText><Spin /></BottomText>
    } else {
      if (data.length <= 0) {
        bottomText = <Empty text = '暂无结果' />
      } else if (isEnd) {
        bottomText = <BottomText>到底啦</BottomText>
      }
    }

    return (
      <Fragment>
        <Search
          value = { this.state.filter.buildingName }
          onChange = { this.handleChange }
          placeholder = '输入楼盘名称'
          bottomBorder
        />
        <Sort
          data = { this.state.filterData }
          value = { this.state.filter }
          onChange = { this.handleFilterChange }
        />
        <HouseList>
          {
            this.state.data.map((v, i) => (
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
        { bottomText }
      </Fragment>
    )
  }
}