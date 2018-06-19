import React, { Component, Fragment } from 'react'
import cs from 'classnames'

import Mask from 'component/mask'

import style from './index.less'

export default class App extends Component {
  static defaultProps = {
    data: ['观山湖区', '物业类型', '价格区间', '不限户型']
  }

  constructor (props) {
    super(props)

    const {
      data
    } = props

    this.state = {
      scrollTop: 0,

      data: data,
      active: -1,

      maskVisible: false
    }
  }

  componentDidMount () {
    this.$content = document.getElementById('content')

    document.addEventListener('click', this.documentClick)
  }

  componentWillReceiveProps (nextProps) {}

  componentWillUnmount () {
    document.removeEventListener('click', this.documentClick)
  }

  documentClick = e => {
    if (this.state.active === -1) {
      return
    }
    if (!e.target.closest(`.${ style['sort'] }`)) {
      this.setState({ active: -1 }, () => {
        this.onClose()
      })
    }
  }

  handleActive = i => {
    this.setState(prevState => ({
      active: prevState.active === i ? -1 : i
    }), () => {
      if (this.state.active > -1) {
        this.onOpen()
      } else {
        this.onClose()
      }
    })
  }

  onOpen = () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = this.$content

    const {
      offsetTop
    } = this.$sort

    // 记录现在的位置，恢复时隐藏
    this.setState({
      scrollTop,
      maskVisible: true
    })

    this.$content.appendChild(this.paddingEl(clientHeight))

    this.$content.scrollTop = offsetTop
    this.$content.style.overflow = 'hidden'
  }

  onClose = () => {
    this.$content.removeChild(this.$el)
    this.$content.style.overflow = 'auto'
    this.$content.scrollTop = this.state.scrollTop

    this.setState({
      maskVisible: false
    })
  }

  paddingEl = (height) => {
    this.$el = document.createElement('div')

    this.$el.style.height = height + 'px'

    return this.$el
  }

  render () {
    const {
      data,
      active
    } = this.state

    return (
      <Fragment>
        <div className = { style['sort'] } ref = { el => { this.$sort = el } }>
          {
            data.map((v, i) => (
              <div
                onClick = { () => { this.handleActive(i) } }

                className = { cs(style['sort-item'], { [style['sort-item-active']]: active === i }) }

                key = { i }
              >
                { v }
              </div>
            ))
          }
        </div>
      </Fragment>
    )
  }
}