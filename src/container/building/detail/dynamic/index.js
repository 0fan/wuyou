import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Icon } from 'antd'
import { Box, Timeline, Info } from 'component/building_detail'
import Empty from 'component/empty'

const { Item } = Timeline

@connect(state => ({
  building: state.building
}))
export default class App extends Component {
  render () {
    const { id } = this.props.match.params
    const {
      renews
    } = this.props.building

    return (
      <Box
        title = '动态跟踪'
        rightContent = { <Link style = { { fontSize: 0 } } to = { `/building/${ id }/detail` }><Icon type = 'close-circle-o' /></Link> }
      >
        <Timeline date>
          {
            renews.length ?
              renews.map((v, i) => (
                <Item
                  date = { new Date(parseInt(v.rawAddTime)) }

                  key = { i }
                >
                  <Info
                    title = { v.content }
                    imgs = { v.dynamicImg ? v.dynamicImg.split(',').filter(v => v).map(v => ({ src: v })) : [] }
                  />
                </Item>
              )) :
              <Empty text = '暂无动态' ratio = { .6 } />
          }
        </Timeline>
      </Box>
    )
  }
}