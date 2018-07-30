import React, { Component, Fragment } from 'react'
import axios from 'axios'
import cs from 'classnames'
import moment from 'moment'

import { Spin } from 'antd'
import Empty from 'component/empty'
import Alert from 'component/alert'
import BottomText from 'component/bottom-text'

import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { getMessageList } = api.i

export default class App extends Component {
  state = {
    data: [],
    mes: '',
    loading: false
  }

  componentDidMount () {
    this.getMessage()
  }

  getMessage = async () => {
    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.get(server + getMessageList)

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: <span>{ err || '获取消息记录失败' } <a href = 'javascript:;' onClick = { () => { this.getMessage() } }>重试</a></span> })

      return [err]
    }

    this.setState({
      data: res.object
    })
    return [null, res]
  }

  render () {
    const {
      msg,
      data,
      loading
    } = this.state
    return (
      <Fragment>
        <Alert message = { msg } fixed />
        {
          loading ?
            <BottomText><Spin /></BottomText> :
            data.length ?
              <List
                renderHeader = {
                  () => <div className = { style.tip }>共有 { data.length } 条消息记录</div>
                }
              >
                {
                  data.map((v, i) => (
                    <List.Item
                      { ...v }

                      key = { i }
                    />
                  ))
                }
              </List> :
              <Empty text = '暂无消息' />
        }
      </Fragment>
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
        { children }
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
    rawAddTime,
    state
  } = props

  return (
    <div className = { cs(style.item, { [style['item-new']]: parseInt(state) === 1 }) }>
      <div className = { style['item-title'] }>
        <span className = { style['item-title-text'] }>{ title }</span>
      </div>
      <div className = { style['item-date'] }>{ moment(rawAddTime).format('YYYY-MM-DD') }</div>
    </div>
  )
}