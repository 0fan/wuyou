import React, { Component } from 'react'
import cs from 'classnames'
import moment from 'moment'

import Image from 'component/image'

import style from './index.less'

class App extends Component {
  constructor (props) {
    super(props)

    this.timer = null

    this.state = {
      time: new Date().getTime()
    }
  }

  componentDidMount () {
    // this.timer = setInterval(() => {
    //   this.setState({
    //     time: new Date().getTime()
    //   })
    // }, 1000)
  }

  componentWillUnmount () {
    // if (this.timer) {
    //   clearInterval(this.timer)
    //   this.timer = null
    // }
  }

  render () {
    const {
      id,
      surplus,
      building,
      period,
      deposit,
      status,
      type,
      time,
      choice,
      primary,
      onClick
    } = this.props

    let formatTime = ''

    let renderTime = '开盘时间:暂无'
    let renderAction = <div className = { cs(style['box-action'], style['box-action-disabled']) }>暂不支持</div>

    if (time) {
      formatTime = moment(time).format('YYYY-MM-DD')
      renderTime = `开盘时间:${ formatTime }`

      // 是否在某个时间范围内（开盘倒计时）
      // if (moment(time).isBetween(moment(this.state.time), moment(this.state.time).add(24, 'h'))) {
      //   const diff = Math.abs(new Date(this.state.time).getTime() - new Date(time).getTime()) / 1000
      //
      //   renderTime = (
      //     <a href = 'javascript:;'>
      //       还剩
      //       { Math.floor(diff / 3600) }小时
      //       { Math.floor(diff % 3600 / 60) }分
      //       { Math.floor(diff % 60) }秒
      //       开盘
      //     </a>
      //   )
      // }
    }

    // 已开盘
    if (status === 0 && choice === 0) {
      renderTime = `${ formatTime } 已开盘`
      renderAction = <div onClick = { () => onClick(id, 0) } className = { style['box-action'] }>立即选房</div>
    }

    // 支持预选且有剩余套数
    if (status === 1 && primary === 0) {
      renderAction = <div onClick = { () => onClick(id, 1) } className = { style['box-action'] }>优先预选</div>
    }

    return (
      <div className = { style['box'] }>
        <div className = { style['box-header'] }>
          当前剩余{ surplus }套
        </div>
        <div className = { style['box-body'] }>
          <div className = { style['box-body-content'] }>
            <div className = { style['box-title'] }>{ `${ building } ${ period }` }</div>
            <div className = { style['box-extra'] }>
              状态：{ status === 0 ? '已开盘' : '未开盘' }
            </div>
            <div className = { style['box-extra'] }>
              类型：{ type.join(' | ') }
            </div>
            <div className = { style['box-time'] }>{ renderTime }</div>
          </div>
          <div className = { style['box-body-right'] }>
            {
              deposit ?
                <div className = { style['box-deposit'] }>定金：￥{ deposit }</div> :
                null
            }

            { renderAction }
          </div>
        </div>
      </div>
    )
  }
}

const List = props => (
  <div className = { style['list'] }>{ props.children }</div>
)

List.Box = App

export default List