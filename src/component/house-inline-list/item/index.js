import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      title,
      area,
      price,
      to,

      children,

      onClick = f => f,

      ...rest
    } = this.props

    return (
      <Item onClick = { onClick } to = { to }>
        <Title text = { title } />
        <Area text = { area } />
        <Price text = { price } />
      </Item>
    )
  }
}


const Item = props => (
  props.to ?
    <Link to = { props.to } className = { style['item'] } onClick = { props.onClick }>{ props.children }</Link> :
    <div className = { style['item'] } onClick = { props.onClick }>{ props.children }</div>
)


const Title = props => (
  <div className = { style['item-title'] }>
    { props.text }
  </div>
)

const Area = props => (
  props.text ?
    <div className = { style['item-area'] }>
      { props.text }
    </div> :
    null
)

const Price = props => (
  props.text && parseFloat(props.text) > 0 ?
    <div className = { style['item-price'] }>
      均价{ props.text }/平
    </div> :
    <div className = { style['item-price'] }>待定</div>
)
