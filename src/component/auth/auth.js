import React, { Component } from 'react'
import { connect } from 'react-redux'
import check from './check'

import getAuth from 'util/getAuth'

export default class App extends Component {
  render () {
    const {
      children,
      auth,
      authList = getAuth(),
      noMatch = null,

      ...rest
    } = this.props

    const childrenRender = (
      typeof children === 'undefined' ?
        null :
        children
    )

    return check(auth, authList, childrenRender, noMatch)
  }
}
