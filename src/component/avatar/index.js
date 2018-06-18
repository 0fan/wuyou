import React, { Component, Fragment } from 'react'

import style from './index.less'

const radian = Math.PI / 180

const rootFontSize = parseFloat(document.querySelector('html').style.fontSize)

export default class App extends Component {
  wrap = null
  els = []

  static defaultProps = {
    type: 'circle',
    data: []
  }

  componentDidMount () {
    setTimeout(() => {
      const { data, type } = this.props

      if (typeof data !== 'string' && type === 'circle' ) {
        const radius = this.wrap.clientWidth / 2
        const len = this.els.length

        const start = len === 4 ? 225 : 270
        const end = 360 + start

        const gap = (end - start) / len

        this.els.forEach((v, i) => {
          const angle = (start + gap * i) * radian

          const x = radius + radius * Math.cos(angle)
          const y = radius + radius * Math.sin(angle)

          v.style.left = x + 'px'
          v.style.top = y + 'px'
        })
      }
    }, 0)
  }

  renderCircleAvatar = (data) => {
    return (
      <div className = { style['avatar-circle'] }>
        <div className = { style['avatar-circle-inner'] } ref = { el => this.wrap = el }>
          {
            data.map((v, i) => (
              <div className = { style['avatar-img-wrap'] } key = { i } ref = { el => this.els[i] = el }>
                <img className = { style['avatar-img'] } src = { v } onLoad = { this.handleLoad } />
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  renderLineAvatar = (data) => {}

  renderSimpleAvatar = (data, size) => {
    let styleString = {}

    if (size) {
      styleString.width = size + 'px'
      styleString.height = size + 'px'
      styleString.borderRadius = size + 'px'
    }

    return (
      <div className = { style['avatar-simple'] } style = { styleString }>
        <img className = { style['avatar-img'] } src = { data } onLoad = { this.handleLoad } />
      </div>
    )
  }

  handleLoad = e => {
    e.target.style.opacity = 1
  }

  renderAvatar = (data, type, size) => {
    if (typeof data === 'string') {
      return this.renderSimpleAvatar(data, size)
    }

    if (type === 'circle') {
      let _data = data.slice(0, 5)

      if (_data.length < 4) {
        _data = _data.concat(Array(4 - _data.length).fill('#'))
      }

      return this.renderCircleAvatar(_data)
    }

    if (type === 'line') {
      return this.renderLineAvatar(data)
    }

    return null
  }

  render () {
    const { data, type, size } = this.props

    return this.renderAvatar(data, type, size)
  }
}
