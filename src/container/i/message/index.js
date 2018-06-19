import React, { Component, Fragment } from 'react'
import axios from 'axios'
import cs from 'classnames'

import { Toast } from 'antd-mobile'

import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { getMessageList } = api.i

export default class App extends Component {
  state = {
    data: Array(10).fill('').map((v, i) => ({
      title: '融创九樾府存款证明办理成功',
      date: '2018-05-29',
      id: i,
      isNew: i <= 3,
    }))
  }

  componentDidMount () {
    this.getMessageList()
  }

  getMessageList = async () => {
    Toast.loading('获取数据中...', 0, null, true)

    const [err, res] = await axios.post(server + getMessageList)

    Toast.hide()

    if (err) {
      Toast.fail(err, 3, null, false)

      return [err]
    }
    return [null, res]
  }

  render () {
    return (
      <List
        renderHeader = {
          () => <div className = { style.tip }>共有 { this.state.data.length } 条消息记录</div>
        }
      >
        {
          this.state.data.map((v, i) => (
            <List.Item
              { ...v }

              key = { i }
            />
          ))
        }
      </List>
    )
  }
}

const List = props => {
  const {
    renderHeader,
    renderFooter,

    children
  } = props

  return (
    <div className = { style['list-wrap'] }>
      {
        renderHeader ?
          <div className = { style['list-header'] }>{ renderHeader() }</div> :
          null
      }
      <div className = { style.list }>
        { props.children }
      </div>
      {
        renderFooter ?
          <div className = { style['list-footer'] }>{ renderFooter() }</div> :
          null
      }
    </div>
  )
}

List.Item = props => {
  const {
    title,
    date,
    id,
    isNew
  } = props

  return (
    <div className = { cs(style.item, { [style['item-new']]: isNew }) }>
      <div className = { style['item-title'] }>
        <span className = { style['item-title-text'] }>{ title }</span>
      </div>
      <div className = { style['item-date'] }>{ date }</div>
    </div>
  )
}