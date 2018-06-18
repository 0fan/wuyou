import React, { Component } from 'react'
import cs from 'classnames'

import style from './index.less'

export default props => {
  const {
    title,
    rightContent,
    leftContent,

    data = [],

    type,
    disabled,

    ...rest
  } = props

  const classString = cs(
    style.card, {
      [style[`card-${ type }`]]: type,
      [style['card-disabled']]: disabled
    }
  )

  return (
    <div className = { classString }>
      <Header
        title = { title }
        rightContent = { rightContent }
        leftContent = { leftContent }
      />
      <Body data = { data } />
    </div>
  )
}

const Header = props => {
  const {
    title,
    leftContent,
    rightContent,
  } = props

  return (
    <div className = { style['card-header'] }>
      <div className = { style['card-header-left'] }>
        <h2>{ title }</h2>
        { leftContent && leftContent() }
      </div>
      <div className = { style['card-header-right'] }>
        { rightContent && rightContent() }
      </div>
    </div>
  )
}

const Body = props => {
  const { data } = props

  return (
    <div className = { style['card-body'] }>
      <div className = { style['card-info-wrap'] }>
        {
          data.map((v, i) => (
            <div className = { style['card-info-item'] } key = { i }>
              {
                v.title ?
                  <span className = { style['card-info-item-title'] }>{ v.title }：</span> :
                  null
              }
              <span className = { style['card-info-item-value'] }>{ v.value }</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
