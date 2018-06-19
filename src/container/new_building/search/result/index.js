import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'

import { Spin } from 'antd'
import Search from 'component/search'
import HouseList from 'component/house-list'
import BottomText from 'component/bottom-text'

import { url, api } from 'config/api'

const { server } = url
const { getBuildingList } = api.new_building

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
        minPrice: '',
        maxPrice: '',
        layOut: '',
        currentPage: 1,
      },
      loading: true,
      isEnd: false
    }
  }

  componentDidMount () {
    this.$content = document.getElementById('content')

    this.getBuilding()

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
  getBuilding = _.debounce(async (isNew) => {
    const { filter } = this.state

    this.setState({ loading: true })

    const [err, res] = await axios.post(server + getBuildingList, filter)

    this.setState({ loading: false })

    if (err) {
      return [err]
    }

    const { object = [] } = res

    this.setState(prevState => ({
      data: isNew ? object : prevState.data.concat(object),
      isEnd: object.length < 5,

      filter: {
        ...prevState.filter,
        currentPage: prevState.filter.currentPage + 1
      }
    }))

    return [null, res]
  }, 500)

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

  render () {
    let bottomText = ''

    const {
      loading,
      isEnd,
      data
    } = this.state

    if (loading) {
      bottomText = <Spin />
    } else {
      if (data.length <= 0) {
        bottomText = '没有数据'
      } else if (isEnd) {
        bottomText = '到底啦'
      }
    }

    return (
      <Fragment>
        <Search
          value = { this.state.filter.buildingName }
          onChange = { this.handleChange }
          placeholder = '输入楼盘名称'
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
        <BottomText>{ bottomText }</BottomText>
      </Fragment>
    )
  }
}