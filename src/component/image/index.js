import React, { Component } from 'react'
import cs from 'classnames'
import LazyLoad from 'react-lazyload'

import { Spin } from 'antd'
import style from './index.less'

export default class App extends Component {
  static defaultProps = {
    onLoad: f => f,
    onError: f => f
  }

  constructor (props) {
    super(props)

    const {
      src = '',
    } = props

    this.state = {
      src,
      load: false,
      error: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({ src: nextProps.src })
    }
  }

  handleLoad = e => {
    this.setState({
      load: true
    })

    this.props.onLoad(e)
  }

  handleError = e => {
    this.setState({
      // 加载失败也算加载完成了
      load: true,
      error: true,
      src: require('./img/404.png')
    })

    this.props.onError(e)
  }

  render () {
    const {
      src,

      ...rest
    } = this.props

    return (
      <LazyLoad
        once
        overflow = { true }
        placeholder = { <Spin className = { style.loading } /> }
        offset = { [0, 0] }

        { ...rest }
      >
        <img
          className = { cs(style.img, {
            [style['img-load']]: this.state.load,
            [style['img-error']]: this.state.error
          }) }
          src = { this.state.src }
          onLoad = { this.handleLoad }
          onError = { this.handleError }
        />
      </LazyLoad>
    )
  }
}
