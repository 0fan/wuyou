import React, { Component, Fragment } from 'react'

import Search from 'component/search'

import style from './index.less'

export default class App extends Component {
  state = {
    value: '',

    hotList: ['融创九樾府', '中环国际', '观府壹号'],
    historyList: ['中环国际', '融创九樾府', '观府壹号']
  }

  handleChange = v => {
    this.setState({
      value: v
    })
  }

  handleSearch = v => {
    const {
      history,
      match: {
        url
      }
    } = this.props

    if (v) {
      history.push(`/new_building/search/${ v }`)
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
          <div className = { style['search-hot-list'] }>
            {
              hot.map((v, i) => (
                <div className = { style['search-hot-list-item'] } onClick = { e => onClick(v, i, e) } key = { i }>{ v }</div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const HistoryList = props => (
  <div className = { style['history'] }>
    <div className = { style['history-header'] }>历史搜索</div>
    <div className = { style['history-body'] }>
      <div className = { style['history-list'] }>
        {
          props.data.map((v, i) => (
            <HistoryList.Item
              value = { v }

              onClick = { e => props.onClick(v, i, e) }

              key = { i }
            />
          ))
        }
      </div>
    </div>
  </div>
)

HistoryList.Item = props => {
  const {
    value,
    onClick
  } = props

  return (
    <div onClick = { props.onClick } className = { style['history-list-item'] }>{ value }</div>
  )
}
