import React, { Component } from 'react'

import { Spin } from 'antd'

export class Bundle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mod: null
    }

    this.load(this.props)
  }

  componentDidMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load) {
      this.load(nextProps)
    }
  }

  load = props => {
    if (this.mounted) {
      this.setState({ mod: null })
    }

    props.load().then(v => {
      if (this.mounted) {
        this.setState({
          mod: v.default ? v.default : v
        })
      }
    }).catch(err => {
      if (this.mounted) {
        this.setState({
          mod: () => <h1>error! <a href = '#' onClick = { e => { e.preventDefault() || this.load(props) } }>点击重试</a></h1>
        })
      }
    })
  }

  render () {
    return (
      this.state.mod ?
        this.props.children(this.state.mod) :
        <Spin style = { { display: 'block', margin: '50px auto 0' } } />
    )
  }
}

export default component => {
  return (props) => {
    return (
      <Bundle load = { component }>
        { App => <App { ...props } /> }
      </Bundle>
    )
  }
}
