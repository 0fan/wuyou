import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { Spin } from 'antd'
import { Modal, Toast } from 'antd-mobile'
import Empty from 'component/empty'
import Alert from 'component/alert'
import BottomText from 'component/bottom-text'

import { url, api } from 'config/api'

import style from './index.less'

import { reset } from 'model/building'

const { alert } = Modal

const { server } = url
const {
  i: { getAuthList },
  building: { auth }
} = api

@connect(state => ({
  building: state.building
}), {
  reset
})
export default class App extends Component {
  isMount = true

  state = {
    loading: false,
    msg: '',
    data: [],

    unbindLoading: false,
    unbindMsg: ''
  }

  componentDidMount () {
    this.getAuthList()
  }

  componentWillUnmount () {
    this.isMount = false
  }

  getAuthList = async () => {
    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.get(server + getAuthList)

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({
        msg: <span>{ err } <a href = 'javascript:;' onClick = { this.getAuthList }>重试</a></span>
      })

      return [err]
    }

    const { object = {} } = res

    this.setState({
      data: Object.keys(object).map(key => ({
        buildingName: key,
        ...object[key]
      }))
    })

    return [null, res]
  }

  unBind = async (id) => {
    this.setState({ unbindLoading: true, unbindMsg: '' })

    const [err, res] = await axios.post(server + auth, {
      buildingId: id
    })

    if (!this.isMount) {
      return
    }

    this.setState({ unbindLoading: false })

    if (err) {
      this.setState({ unbindMsg: err })

      return [err]
    }

    return [null, res]
  }

  handleUnbind = (v, i, e) => {
    e.preventDefault()

    const a = alert(<span>解绑<span style = { { color: '#F41906' } }>{ v.buildingName }</span></span>, '解除授权后，无法为您提供楼盘跟踪服务 确定要解除吗？', [{
      text: '再考虑下'
    }, {
      text: '我确定',
      onPress: async () => {
        Toast.loading('解绑中...', 0, null, true)

        const [err, res] = await this.unBind(v.buildingId)

        Toast.hide()

        if (err) {
          Toast.fail(err, 3, null, false)

          return
        }

        Toast.success(`解除${ v.buildingName }授权成功`, 3, null, false)

        // 重置楼盘详情
        this.props.reset()

        this.setState(prevState => ({
          data: prevState.data.filter(_v => _v.buildingId !== v.buildingId)
        }))
      }
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
            onClick = { e => this.handleUnbind(v, i, e) }
            data = { v }

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
    您已同意授权贵阳房产公众服务通过<br />重庆壹平方米网络科技有限公司 [ <strong>存款证明</strong> ] 业务<br />获取您于<strong>{ props.data.buildingName }</strong>的个人业务信息为您提供购房跟踪服务
    </div>
    <div className = { style['box-footer'] } onClick = { props.onClick }>解除授权</div>
  </div>
)