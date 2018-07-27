import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link, Redirect } from 'react-router-dom'

import { AuthRouter } from 'component/auth'
import Empty from 'component/empty'
import { getRoutes } from 'util/getRoutes'

@connect(state => ({
  user: state.user,
  building: state.building
}))
export default class App extends Component {
  render () {
    const { id } = this.props.match.params

    const {
      user: { auth },
      building: {
        loading,
        msg,
        authorization
      },
      routerData,
      match: {
        url,
        path
      }
    } = this.props

    if (loading) {
      return null
    }

    if (msg) {
      return <Empty text = { <span>{ msg }</span> } type = 'network' />
    }

    const progress = routerData['/building/:id/track/progress']
    const protocol = routerData['/building/:id/track/protocol']

    let redirectPath = `/building/${ id }/track/progress`

    if (auth && !authorization) {
      redirectPath = `/building/${ id }/track/protocol`
    }

    return (
      <Switch>
        <Route
          path = '/building/:id/track/progress'

          render = {
            props => {
              if (auth && !authorization) {
                return <Redirect to = { `/building/${ id }/track/protocol` } />
              }

              return progress.component()
            }
          }
        />
        <Route
          path = '/building/:id/track/protocol'

          render = {
            props => {
              if (!auth || (auth && authorization)) {
                return <Redirect to = { `/building/${ id }/track/progress` } />
              }

              return protocol.component()
            }
          }

          exact = { true }
        />
        <Redirect exact from = { url } to = { redirectPath }></Redirect>
      </Switch>
    )
  }
}
