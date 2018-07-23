import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Icon } from 'antd'
import { Box, Srcoll } from 'component/building_detail'
import BottomText from 'component/bottom-text'
import { Map as AMap, Marker } from 'react-amap'

import style from './index.less'

@connect(state => ({
  building: state.building
}))
export default class App extends Component {
  render () {
    const { id } = this.props.match.params
    const {
      renews,
      atlas,
      buildingType,

      longitude,
      latitude
    } = this.props.building

    let topNews = {
      content: null,
      imgs: []
    }

    if (renews && renews[0]) {
      topNews.content = renews[0].content

      if (typeof renews[0].dynamicImg === 'string') {
        topNews.imgs = renews[0].dynamicImg.split(',').filter(v => v).map(v => ({
          src: v
        }))
      }
    }

    return (
      <div className = { style[''] }>
        <Box
          title = '动态'
          titleExtra = '2018-05-31'
          rightContent = { <Link to = { `/building/${ id }/detail/dynamic` }><Icon type = 'clock-circle-o' /></Link> }
        >
          <Srcoll
            headerContent = { topNews.content }
            data = { topNews.imgs }
          />
        </Box>
        <Box
          title = '图集'
        >
          <Srcoll
            size = { [164, 110] }
            data = { atlas.map(v => ({ src: v })) }
          />
        </Box>
        <Box
          title = '户型'
        >
          <Srcoll
            size = { [164, 110] }
            data = { buildingType.map(v => ({
              ...v,
              src: v.imgUrlMobie,
              title: v.typeName + ' ' + v.remark + ' ' + (v.withinArea  ? '套内' + v.withinArea + '㎡' : '建面' + v.buildArea + '㎡')
            })) }
          />
        </Box>
        <Map
          longitude = { longitude }
          latitude = { latitude }
        />
      </div>
    )
  }
}

const Map = props => {
  const {
    longitude,
    latitude
  } = props

  let isError = false

  // 如果没有经纬度
  if (_.isNil(longitude) || _.isNil(latitude)) {
    isError = true
  }

  return (
    <div className = { style.map }>
      {
        !isError ?
          <Fragment>
            <div className = { style['map-container'] }>
              <AMap
                zoom = { 12 }
                center = { [longitude, latitude] }
                amapkey = { '594b054bb8b564f526cc42c493fe1400' }
              >
                <Marker position = { [longitude, latitude] }>
                  <div className = { style['map-marker'] }></div>
                </Marker>
              </AMap>
            </div>
          </Fragment> :
          <BottomText>没有该楼盘坐标信息</BottomText>
      }
    </div>
  )
}
