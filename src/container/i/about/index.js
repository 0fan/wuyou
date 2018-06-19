import React, { Component, Fragment } from 'react'
import axios from 'axios'

import Image from 'component/image'

import { Toast } from 'antd-mobile'
import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { about } = api.i

export default class App extends Component {
  state = {
    logo: '',
    src: '',

    loading: false
  }

  componentDidMount () {
    this.getAbout()
  }

  componentWillUnmount () {
    Toast.hide()
  }

  getAbout = async () => {
    Toast.loading('获取数据中', 0, null, true)

    const [err, res] = await axios.get(server + about)

    if (err) {
      Toast.fail(err, 3, null, false)

      return
    }

    const {
      imgPath,
      buttonLinkHref
    } = res.object[0]

    this.setState({
      logo: imgPath,
      src: buttonLinkHref,
      loading: buttonLinkHref ? true : false
    })

    if (buttonLinkHref) {
      this.setState({})
    }
  }

  handleLoad = () => {
    this.setState({ loading: false })

    Toast.hide()
  }

  handleError = () => {
    this.setState({ loading: false })

    Toast.fail('获取数据失败', 3, null, false)
  }

  render () {
    return (
      <Fragment>
        <Logo src = { this.state.logo } />
        <Iframe src = { this.state.src } onLoad = { this.handleLoad } onError = { this.handleError } />
      </Fragment>
    )
  }
}

const Logo = props => {
  const {
    src
  } = props

  return (
    src ?
      <div className = { style['logo'] }>
        <Image src = { src } />
      </div> :
      null
  )
}

const Text = props => (
  <div className = { style['text'] }>{ props.children }</div>
)

const Iframe = props => {
  const {
    src,
    onLoad = f => f,
    onError = f => f
  } = props

  return (
    <iframe
      src = { src }

      onLoad = { onLoad }
      onError = { onError }

      frameBorder = '0'

      className = { style.iframe }
    />
  )
}
