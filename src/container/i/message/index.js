import React, { Component, Fragment } from 'react'
import cs from 'classnames'

import style from './index.less'

export default class App extends Component {
  state = {
    data: Array(10).fill('').map((v, i) => ({
      title: '融创九樾府存款证明办理成功',
      date: '2018-05-29',
      id: i,
      isNew: i <= 3,
    }))
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