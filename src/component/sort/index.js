import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import cs from 'classnames'

import Bounding from './bounding'
import Mask from 'component/mask'

import style from './index.less'

const getData = (type) => [{ label: `不限${ type }`, value: '' }].concat(Array(_.random(5, 20)).fill('').map((v, i) => ({
  id: i,
  label: `${ type }${ i }`,
  value: i
})))

export default class App extends Component {
  static defaultProps = {
    onChange: f => f,
    onOpen: f => f,
    onClose: f => f,
    data: {}
  }

  constructor (props) {
    super(props)

    const {
      value,
      data
    } = props

    this.state = {
      scrollTop: 0,

      value: value ? value : Array(data.length).fill(''),
      data: data,
      active: -1,

      isOpen: false
    }
  }

  componentDidMount () {
    this.$content = document.getElementById('content')

    document.addEventListener('click', this.documentClick)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value) {
      this.setState({ value: nextProps.value })
    }
    if (nextProps.data) {
      this.setState({
        data: nextProps.data,
        value: nextProps.value ? nextProps.value : Array(nextProps.data.length).fill('')
      })
    }
  }

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
        if (!this.state.isOpen) {
          this.onOpen()
        }
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
      maskVisible: true,
      isOpen: true
    })

    this.$content.appendChild(this.paddingEl(clientHeight))

    this.$content.scrollTop = offsetTop
    this.$content.style.overflow = 'hidden'

    this.props.onOpen()
  }

  onClose = () => {
    this.$content.removeChild(this.$el)
    this.$content.style.overflow = 'auto'
    this.$content.scrollTop = this.state.scrollTop

    this.setState({
      maskVisible: false,
      isOpen: false
    })

    this.props.onClose()
  }

  paddingEl = (height) => {
    if (!this.$el) {
      this.$el = document.createElement('div')
    }

    this.$el.style.height = height + 'px'

    return this.$el
  }

  handleSelect = (v, i, k, e) => {
    const { value } = this.state

    this.setState({
      value: {
        ...value,
        [k]: v.value
      }
    }, () => {
      this.props.onChange(this.state.value)
    })
  }

  render () {
    const {
      value,
      data,
      active
    } = this.state

    const keys = Object.keys(data)
    const _data = keys.map(v => data[v])

    return (
      <Fragment>
        <div className = { style['sort'] } ref = { el => { this.$sort = el } }>
          <div className = { style['sort-inner'] }>
            {
              _data.map((v, i) => {
                const selectData = v.filter(_v => _v.value === value[keys[i]])

                if (!selectData[1]) {
                  return null
                }

                return (
                  <div
                    onClick = { () => { this.handleActive(i) } }

                    className = { cs(style['sort-item'], { [style['sort-item-active']]: active === i }) }

                    key = { i }
                  >
                    <span>{ selectData.label }</span>
                  </div>
                )
              })
            }
          </div>
          {
            _data.map((v, i) => (
              <Bounding
                onClick = { (_v, _i, e) => this.handleSelect(_v, i, keys[i], e) }
                value = { value[keys[i]] }
                data = { v }
                visible = { active === i }
                top = { 48 }

                key = { i }
              />
            ))
          }
        </div>
        <Mask
          visible = { active !== -1 }
          top = { 48 }
          zIndex = { 400 }
          animate = { false }
        />
      </Fragment>
    )
  }
}