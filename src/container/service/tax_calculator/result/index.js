import React, { Component, Fragment } from 'react'
import cs from 'classnames'

import Context from 'context/config'

import BottomText from 'component/bottom-text'

import style from './inde.less'

class App extends Component {
  componentDidMount () {
    const {
      contentConfig,
      changeContent,
      footerConfig,
      changeFooter
    } = this.props

    if (footerConfig.length) {
      changeFooter([])
    }

    if (!contentConfig.flex) {
      changeContent({ flex: true })
    }
  }

  render () {
    return (
      <Wrap>
        <Box title = '房款总额' value = '10000元' />
        <Box title = '工本费' value = '5元' />
        <Box title = '契税' value = '15000元' />
        <Box title = '权属登记费' value = '80元' />
        <Box title = '维修基金' value = '30000元' />
        <Box title = '合计' value = '45585元' reverse />
        <BottomText>计算结果仅供参考</BottomText>
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
    value,
    reverse
  } = props

  return (
    <div
      className = {
        cs(style['box'], {
          [style['box-reverse']]: reverse
        })
      }
    >
      <div className = { style['box-title'] }>{ title }</div>
      <div className = { style['box-value'] }>{ value }</div>
    </div>
  )
}

export default props => (
  <Context.Consumer>
    {
      arg => <App { ...props } { ...arg } />
    }
  </Context.Consumer>
)