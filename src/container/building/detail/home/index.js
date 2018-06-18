import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Icon } from 'antd'
import { Box, Srcoll } from 'component/building_detail'
import Button from 'component/button'
import { Map as AMap, Marker } from 'react-amap'

import style from './index.less'

const data = Array(10).fill({
  src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=360869140,1895507837&fm=27&gp=0.jpg'
})

const data2 = Array(10).fill({
  title: 'A户型 两室 套内68m²',
  src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=360869140,1895507837&fm=27&gp=0.jpg'
})

export default class App extends Component {
  render () {
    const { id } = this.props.match.params

    return (
      <div className = { style[''] }>
        <Box
          title = '动态'
          titleExtra = '2018-05-31'
          rightContent = { <Link to = { `/building/${ id }/detail/dynamic` }><Icon type = 'clock-circle-o' /></Link> }
        >
          <Srcoll
            headerContent = { <span>融创九樾府5月25日2栋大平层开盘</span> }
            data = { data }
          />
        </Box>
        <Box
          title = '图集'
        >
          <Srcoll
            size = { [164, 110] }
            data = { data }
          />
        </Box>
        <Box
          title = '户型'
        >
          <Srcoll
            size = { [164, 110] }
            data = { data2 }
          />
        </Box>
        <Map />
      </div>
    )
  }
}

const Map = props => {
  const center = [106.5372562408, 29.5615871875]

  return (
    <div className = { style.map }>
      <div className = { style['map-container'] }>
        <AMap
          zoom = { 12 }
          center = { center }
          amapkey = { '594b054bb8b564f526cc42c493fe1400' }
        >
          <Marker position = { center }>
            <div className = { style['map-marker'] }></div>
          </Marker>
        </AMap>
      </div>
      <div className = { style['map-navigation'] }>
        <Button type = 'primary'>导航到该地址</Button>
      </div>
    </div>
  )
}
