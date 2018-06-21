import React, { Component, Fragment } from 'react'

import { Spin } from 'antd'
import { Modal } from 'antd-mobile'
import Empty from 'component/empty'
import Alert from 'component/alert'
import BottomText from 'component/bottom-text'

import style from './index.less'

const { alert } = Modal

export default class App extends Component {
  state = {
    loading: '',
    msg: '',
    data: []
  }

  handleUnbind = e => {
    e.preventDefault()

    const a = alert('提示', '解除授权后，无法为您提供楼盘跟踪服务 确定要解除吗？', [{
      text: '再考虑下'
    }, {
      text: '我确定'
    }])
  }

  render () {
    const { msg, loading, data } = this.state

    let renderChildren = null

    if (loading) {
      renderChildren = <BottomText><Spin /></BottomText>
    } else {
      if (!data.length) {
        renderChildren = <Empty text = '暂无授权' />
      } else {
        renderChildren = data.map((v, i) => (
          <Box
            onClick = { this.handleUnbind }

            key = { i }
          />
        ))
      }
    }

    return (
      <Fragment>
        <Alert message = { this.state.msg } />
        { renderChildren }
      </Fragment>
    )
  }
}

const Box = props => (
  <div className = { style.box }>
    <div className = { style['box-body'] }>
    您已同意授权筑房无忧通过<br />重庆壹平方米网络科技有限公司 [ <strong>存款证明</strong> ] 业务 获取您的个人业务信息并为您提供购房跟踪服务
    </div>
    <div className = { style['box-footer'] } onClick = { props.onClick }>解除授权</div>
  </div>
)