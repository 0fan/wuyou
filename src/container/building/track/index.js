import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link, Redirect } from 'react-router-dom'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

@connect(state => ({
  user: state.user,
  building: state.building
}))
export default class App extends Component {
  render () {
    const { id } = this.props.match.params
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
        <Redirect exact from = { url } to = { `/building/${ id }/track/progress` }></Redirect>
      </Switch>
    )
  }
}
