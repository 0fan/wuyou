import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Avatar from 'component/avatar'
import List from 'component/list'
import BottomText from 'component/bottom-text'

import style from './index.less'

const { Item } = List

@connect(state => ({
  user: state.user
}), {})
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
      userType,
      id,
      headPhoto = ''
    },

    children,

    ...rest
  } = props

  const renderRole = code => {
    switch (code) {
      case '0':
        return <span className = { style['panel-name-role'] }>准业主</span>
      case '1':
        return <span className = { style['panel-name-role'] }>管理员</span>
      default:
        return null
    }
  }

  if (!auth) {
    return (
      <div className = { style.panel }>
        <div className = { style['panel-auth'] }>
          <h2>绑定后享受更多服务</h2>
          <Link className = { style['panel-auth-login'] } to = '/login'>绑定</Link>
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
          { renderRole(userType) }
        </div>
        {
          id ?
            <div className = { style['panel-id'] }>ID { id }</div> :
            null
        }
      </div>
      <div className = { style['panel-right'] }>
        <Avatar size = { 62 } data = { headPhoto ? headPhoto : require('asset/img/default_avatar.png') } />
      </div>
    </div>
  )
}