import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'
import store from 'store'

import { Icon } from 'antd'
import Search from 'component/search'
import BottomText from 'component/bottom-text'

import style from './index.less'

export default class App extends Component {
  state = {
    value: '',

    // hotList: ['融创九樾府', '中环国际', '观府壹号'],
    hotList: [],
    historyList: []
  }

  componentDidMount () {
    const historyList = store.get('history-search') || []
    this.setState({ historyList })
  }

  // 在这里时保存历史搜索记录
  componentWillUnmount () {
    // 保持数据唯一性
    store.set('history-search', _.uniq(this.state.historyList))
  }

  handleChange = v => {
    this.setState({
      value: v
    })
  }

  handleRemoveHistory = (v, i, e) => {
    e.stopPropagation()

    this.setState(prevState => ({
      historyList: prevState.historyList.filter((_v, _i) => i !== _i)
    }))
  }

  handleSearch = v => {
    const {
      history,
      match: {
        url
      }
    } = this.props

    if (v) {
      this.setState(prevState => ({
        value: v,
        historyList: prevState.historyList.concat(v)
      }), () => {
        history.push(`/new_building/search/${ v }`)
      })
    }
  }

  render () {
    return (
      <Fragment>
        <SearchBox
          value = { this.state.value }
          hot = { this.state.hotList }

          onChange = { this.handleChange }
          onSubmit = { this.handleSearch }
          onClick = { this.handleSearch }
        />
        <HistoryList
          data = { this.state.historyList }
          onClick = { this.handleSearch }
          onDelete = { this.handleRemoveHistory }
        />
      </Fragment>
    )
  }
}

const SearchBox = props => {
  const {
    onClick,
    hot,

    ...rest
  } = props

  return (
    <div className = { style['search'] }>
      <Search placeholder = '输入楼盘名称' { ...rest } />
      <div className = { style['search-hot'] }>
        <div className = { style['search-hot-title'] }>热门搜索</div>
        <div className = { style['search-hot-content'] }>
          {
            hot && hot.length ?
              <div className = { style['search-hot-list'] }>
                {
                  hot.map((v, i) => (
                    <div
                      className = { style['search-hot-list-item'] }
                      onClick = { e => onClick(v, i, e) } key = { i }
                    >
                      { v }
                    </div>
                  ))
                }
              </div> :
              <BottomText style = { { padding: '10px 0' } }>没有数据</BottomText>
          }
        </div>
      </div>
    </div>
  )
}

const HistoryList = props => {
  const {
    data,
    onDelete = f => f
  } = props

  return (
    <div className = { style['history'] }>
      <div className = { style['history-header'] }>历史搜索</div>
      <div className = { style['history-body'] }>
        {
          data && data.length ?
            <div className = { style['history-list'] }>
              {
                props.data.map((v, i) => (
                  <HistoryList.Item
                    value = { v }

                    onClick = { e => props.onClick(v, i, e) }
                    onDelete = { e => onDelete(v, i, e) }

                    key = { i }
                  />
                ))
              }
            </div> :
            <BottomText>没有数据</BottomText>
        }
      </div>
    </div>
  )
}

HistoryList.Item = props => {
  const {
    value,
    onClick,
    onDelete
  } = props

  return (
    <div onClick = { props.onClick } className = { style['history-list-item'] }>
      { value }
      <Icon type = 'close' className = { style['history-list-item-remove'] } onClick = { e => { onDelete(e) } } />
    </div>
  )
}
