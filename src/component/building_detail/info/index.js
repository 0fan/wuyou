import React, { Component } from 'react'

import { Row, Col } from 'antd'
import Image from 'component/image'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      title,
      imgs = [],
      limit = 6
    } = this.props

    return (
      <div className = { style['box'] }>
        {
          title ?
            <div className = { style['box-title'] }>{ title }</div> :
            null
        }
        <ImageList data = { imgs } limit = { limit } />
      </div>
    )
  }
}

const ImageList = props => {
  const {
    data,
    limit,
    onClick
  } = props

  if (!data || !data.length) {
    return null
  }

  if (data.length <= 1) {
    return (
      <div className = { style['img-wrap'] }>
        <div className = { style['img-item-wrap'] } style = { { height: '200px' } }>
          <Image height = { 200 } src = { data[0].src } />
        </div>
      </div>
    )
  }

  return (
    <div className = { style['img-wrap'] }>
      <Row gutter = { 8 }>
        {
          data.slice(0, limit).map((v, i) => (
            <Col span = { 12 } key = { i }>
              <div className = { style['img-item-wrap'] } onClick = { onClick }>
                <Image height = { 96 } src = { v.src } />
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}
