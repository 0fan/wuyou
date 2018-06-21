import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link, Redirect } from 'react-router-dom'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

@connect(state => ({
  user: state.user
}))
export default class App extends Component {
  constructor (props) {
    super(props)

    const {
      user: {
        auth
      },
      history
    } = props

    // 如果是已登录的用户则无权限进入新盘页面
    if (auth) {
      history.push('/house')
    }
  }

  render () {
    const {
      routerData,
      match: {
        path
      }
    } = this.props

    return (
      <Switch>
        {
          getRoutes(path, routerData).map((v, i) => (
            <AuthRouter
              auth = { v.auth }

              component = { v.component }

              path = { v.path }
              exact = { v.exact }

              redirectPath = '/login'

              key = { v.key }
            />
          ))
        }
        <Redirect exact from = '/new_building' to = '/new_building/home' />
      </Switch>
    )
  }
}
