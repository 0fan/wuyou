import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Icon } from 'antd'
import { Box, Timeline, Info } from 'component/building_detail'

const { Item } = Timeline

export default class App extends Component {
  render () {
    const { id } = this.props.match.params

    return (
      <Box
        title = '动态跟踪'
        rightContent = { <Link to = { `/building/${ id }/detail` }><Icon type = 'close-circle-o' /></Link> }
      >
        <Timeline date>
          <Item
            date = { new Date() }
          >
            <Info
              title = ''
              imgs = { Array(8).fill({
                src: 'http://img0.imgtn.bdimg.com/it/u=861920239,2270247053&fm=27&gp=0.jpg'
              }) }
            />
          </Item>
          <Item
            date = { new Date() }
          >
            <Info
              title = '龙湖昱湖壹号都会4月25日开工大吉，一期项目施工进行中'
              imgs = { Array(1).fill({
                src: 'http://img0.imgtn.bdimg.com/it/u=861920239,2270247053&fm=27&gp=0.jpg'
              }) }
            />
          </Item>
          <Item
            date = { new Date() }
          >
            <Info
              imgs = { Array(8).fill({
                src: 'http://img0.imgtn.bdimg.com/it/u=861920239,2270247053&fm=27&gp=0.jpg'
              }) }
            />
          </Item>
          <Item
            date = { new Date() }
          >
            <Info
              title = '龙湖昱湖壹号都会4月25日开工大吉，一期项目施工进行中'
            />
          </Item>
        </Timeline>
      </Box>
    )
  }
}