import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from './auth'

export default class AuthRouter extends Component {
  render () {
    const {
      auth,
      authList,
      component: Component,
      render,
      redirectPath,

      ...rest
    } = this.props

    return (
      <Auth
        auth = { auth }
        authList = { authList }
        noMatch = {
          <Route
            { ...rest }

            render = {
              () => <Redirect to = { { pathname: redirectPath } } />
            }
          />
        }
      >
        <Route
          { ...rest }

          render = {
            props => (
              Component ?
                <Component { ...props } /> :
                render(props)
            )
          }
        />
      </Auth>
    )
  }
}
