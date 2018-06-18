import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Avatar from 'component/avatar'
import List from 'component/list'
import BottomText from 'component/bottom-text'

import { reset } from 'model/user'

import style from './index.less'

const { Item } = List

@connect(state => ({
  user: state.user
}), {
  reset
})
export default class App extends Component {
  render () {
    const {
      user: userData,
      user: {
        auth
      },
      match: {
        url
      }
    } = this.props

    return (
      <Fragment>
        <Panel
          auth = { auth }
          userData = { userData }
        />
        <List>
          <Item title = '消息记录' to = '/i/message' />
          <Item title = '账号设置' to = '/i/setting' />
          <Item title = '授权管理' to = '/i/auth' />
          <Item title = '反馈建议' to = '/i/feedback' />
          <Item title = '关于我们' to = '/i/about' />
        </List>
        <button onClick = { this.props.reset }>退出</button>
        <BottomText>
          <p>筑房无忧</p>
          <p>v1.0.0</p>
        </BottomText>
      </Fragment>
    )
  }
}

const Panel = props => {
  const {
    auth,
    userData: {
      nickName,
      role,
      id,
      avatar = ''
    },

    children,

    ...rest
  } = props

  if (!auth) {
    return (
      <div className = { style.panel }>
        <div className = { style['panel-auth'] }>
          <h2>登录后享受更多服务</h2>
          <Link className = { style['panel-auth-login'] } to = '/login'>微信登录</Link>
        </div>
      </div>
    )
  }

  return (
    <div className = { style.panel }>
      <div className = { style['panel-content'] }>
        <div className = { style['panel-name'] }>
          <span className = { style['panel-name-text'] }>
            {
              nickName && nickName.length > 20 ?
                nickName.slice(0, 20).concat('...') :
                nickName
            }
          </span>
          {
            role ?
              <span className = { style['panel-name-role'] }>{ role }</span> :
              null
          }
        </div>
        {
          id ?
            <div className = { style['panel-id'] }>ID { id }</div> :
            null
        }
      </div>
      <div className = { style['panel-right'] }>
        <Avatar size = { 62 } data = { avatar } />
      </div>
    </div>
  )
}