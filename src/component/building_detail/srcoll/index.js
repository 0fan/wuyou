import React from 'react'

import Image from 'component/image'
import BottomText from 'component/bottom-text'
import Empty from 'component/empty'

import style from './index.less'

const Box =  props => {
  const {
    size = [108, 72],
    radius = 5,
    data = [],

    headerContent,
    footerContent,

    onClick = f => f,

    children,

    ...rest
  } = props

  return (
    <div className = { style.box } { ...rest }>
      {
        headerContent ?
          <div className = { style['box-header'] }>{ headerContent }</div> :
          null
      }
      {
        children || data.length ?
          <div className = { style['box-wrap'] }>
            <div className = { style['box-list'] }>
              {
                children ?
                  children :
                  data.map((v, i) => (
                    <Box.Item
                      size = { size }
                      radius = { radius }
                      data = { v }

                      onClick = { e => { onClick(v, i, e) } }

                      key = { i }
                    />
                  ))
              }
            </div>
          </div> :
          !headerContent && !footerContent ?
            <Empty text = '没有数据' ratio = { .5 } /> :
            null
      }
      {
        footerContent ?
          <div className = { style['box-header'] }>{ footerContent }</div> :
          null
      }
    </div>
  )
}


Box.Item = props => {
  const {
    data,
    size,
    radius,
    onClick = f => f,

    ...rest
  } = props

  const styleString = {
    width: size[0] + 'px',
    height: size[1] + 'px',
    borderRadius: radius + 'px'
  }

  const titleString = {
    width: size[0] + 'px',
  }

  return (
    <div className = { style.item } onClick = { onClick } { ...rest }>
      <div className = { style['item-wrap'] } style = { styleString }>
        <Image src = { data.src } width = { size[0] } height = { size[1] } />
      </div>
      {
        data.title ?
          <div className = { style['item-title'] } style = { titleString }>{ data.title }</div> :
          null
      }
    </div>
  )
}

export default Box
