import React, { Component } from 'react'
import { Switch, Route, Redirect, HashRouter as Router } from 'react-router-dom'

import { getRouterData } from './common/router'
import { getRoutes } from 'util/getRoutes'

const routerData = getRouterData()

const Login = routerData['/login'].component
const BindPhone = routerData['/bind_phone'].component
const BasicLayout = routerData['/'].component

export default class App extends Component {
  render () {

    return (
      <Router>
        <Switch>
          <Route path = '/login' component = { Login } />
          <Route path = '/bind_phone' component = { BindPhone } />
          <Route path = '/' component = { BasicLayout } />
        </Switch>
      </Router>
    )
  }
}