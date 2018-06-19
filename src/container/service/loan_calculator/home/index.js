import React, { Component } from 'react'
import cs from 'classnames'
import { Link } from 'react-router-dom'

import Context from 'context/config'

import style from './index.less'

class App extends Component {
  componentDidMount () {
    const {
      footerConfig,
      changeFooter
    } = this.props

    if (footerConfig.length) {
      changeFooter([])
    }
  }

  render () {
    return (
      <Wrap>
        <Box to = '/service/loan_calculator/common' title = '通用计算' text = '商业贷款 / 公积金贷款独立计算' type = 'common' />
        <Box to = '/service/loan_calculator/combine' title = '组合计算' text = '商业贷款商业贷款 / 公积金贷款组合计算' type = 'combine' />
      </Wrap>
    )
  }
}

const Wrap = props => (
  <div className = { style['wrap'] }>{ props.children }</div>
)

const Box = props => {
  const {
    title,
    text,
    type,
    to
  } = props

  return (
    <Link to = { to } className = { cs(style['box'], style[`box-${ type }`]) }>
      <div className = { style['box-title'] }>{ title }</div>
      <div className = { style['box-extra'] }>{ text }</div>
    </Link>
  )
}

export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)