import React, { Component } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

export default class App extends Component {
  render () {
    const {
      routerData,
      match: {
        url,
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
        <Redirect exact from = { url } to = { `${ url }/certificate` } />
      </Switch>
    )
  }
}
