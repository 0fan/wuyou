import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import Image from 'component/image'
// import LazyLoad from 'react-lazyload'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      src,

      title,
      area,
      tag = [],
      price,
      to,

      children,

      onClick = f => f,

      ...rest
    } = this.props

    return (
      <Item onClick = { onClick } to = { to }>
        <Preview src = { src } />
        <Info>
          <Title text = { title } />
          <Area text = { area } />
          <Tag data = { tag } />
          <Price text = { price } />
        </Info>
      </Item>
    )
  }
}

const Item = props => (
  props.to ?
    <Link to = { props.to } className = { style['item'] } onClick = { props.onClick }>{ props.children }</Link> :
    <div className = { style['item'] } onClick = { props.onClick }>{ props.children }</div>
)

const Preview = props => (
  props.src ?
    <div className = { style['item-preview'] }>
      <Image height = { 84 } src = { props.src } />
    </div> :
    null
)

const Placeholder = () => <span>hello world</span>

const Info = props => (
  <div className = { style['item-info'] }>{ props.children }</div>
)

const Title = props => (
  <div className = { style['item-info-title'] }>
    { props.text }
  </div>
)

const Area = props => (
  props.text ?
    <div className = { style['item-info-area'] }>
      { props.text }
    </div> :
    null
)

const Tag = props => (
  props.data.length ?
    <div className = { style['item-info-tag'] }>
      {
        props.data.map((v, i) => (
          <div className = { style['item-info-tag-item'] } key = { i } >
            { v }
          </div>
        ))
      }
    </div> :
    null
)

const Price = props => (
  props.text && parseFloat(props.text) > 0 ?
    <div className = { style['item-info-price'] }>
      均价{ props.text }元/平
    </div> :
    <div className = { style['item-info-price'] }>待定</div>
)
