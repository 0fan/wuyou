import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import cs from 'classnames'

import { Modal as AntdModal } from 'antd-mobile'
import Modal from 'component/modal'

import Context from 'context/config'

import style from './index.less'

const { alert } = AntdModal

class App extends Component {
  $building = null
  $floor = null
  $house = null

  state = {
    visibleTip: false,

    activeBuilding: 0,
    activeFloor: 0,
    activeHouse: '',

    data: Array(10).fill(0).map((v, i) => ({
      id: i,
      name: `${ i + 1 }栋`,
      children: Array(20).fill(0).map((_v, _i) => ({
        id: _i,
        name: `${ _i + 1 }楼`,
        children: Array(80).fill(0).map((__v, __i) => ({
          id: __i,
          name: `${ i }${ _i }${ __i }`
        }))
      }))
    }))
  }

  componentDidMount () {
    this.setState({ visibleTip: true })

    const {
      match: {
        url
      },
      footerConfig,
      changeFooter,
      contentConfig,
      changeContent
    } = this.props

    if (!contentConfig.flex) {
      changeContent({ flex: true })
    }

    if (!footerConfig.length || footerConfig[0] && footerConfig[0].text !== '在线选房') {
      changeFooter([{
        type: 'building',
        to: '/service/choice_house/certificate',
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }
  }

  handleBuildingClick = (v, i, e) => {
    this.setState({
      activeBuilding: v.id,
      activeFloor: 0,
      activeHouse: '',
    })

    this.$floor.scrollTop = 0
    this.$house.scrollTop = 0
  }

  handleFloorClick = (v, i, e) => {
    this.setState({
      activeHouse: '',
      activeFloor: v.id,
    })

    this.$house.scrollTop = 0
  }

  handleHouseClick = (v, i, e) => {
    this.setState({
      activeHouse: v.id,
    })

    const building = this.state.data.find(v => v.id === this.state.activeBuilding)
    const floor = building.children.find(v => v.id === this.state.activeFloor)
    const room = v

    const alertInstance = alert('提示', `确定选择 ${ building.name }${ floor.name }${ v.name }房 吗?`, [
      { text: '再考虑下', style: 'default' },
      { text: '我确定', onPress: () => {
        this.props.history.push('/service/choice_house/i')
      } },
    ])
  }

  render () {
    const {
      activeBuilding,
      activeFloor,
      activeHouse,
      data
    } = this.state

    let currentFloor = data.find(v => v.id === activeBuilding)
    let currentHouse = currentFloor.children.find(v => v.id === activeFloor).children

    return (
      <Fragment>
        <Layout>
          <Header
            active = { activeBuilding }
            data = { this.state.data }
            onClick = { this.handleBuildingClick }
            onLoad = { el => this.$building = el }
          />
          <Layout hasSider>
            <Sider
              active = { activeFloor }
              data = { currentFloor.children }
              onClick = { this.handleFloorClick }
              onLoad = { el => this.$floor = el }
            />
            <Content
              active = { activeHouse }
              data = { currentHouse }
              onClick = { this.handleHouseClick }
              onLoad = { el => this.$house = el }
            />
          </Layout>
        </Layout>
        <Modal
          visible = { this.state.visibleTip }
          onClose = { () => this.setState({ visibleTip: false }) }
        >
          <h2>选房说明</h2>
          <p>1个存款证明只能锁定1套房源，锁定后无法更改，请谨慎选择</p>
        </Modal>
      </Fragment>
    )
  }
}

const Layout = props => (
  <div className = { cs(style.layout, { [style['layout-has-sider']]: props.hasSider }) }>{ props.children }</div>
)

const Header = props => {
  const {
    active,
    onClick,
    data,
    onLoad
  } = props

  return (
    <div className = { style.header }>
      <div className = { style['building'] } ref = { el => onLoad(el) }>
        <div className = { style['building-list'] }>
          {
            data.map((v, i) => (
              <div
                onClick = { e => { onClick(v, i, e) } }

                className = {
                  cs(style['building-item'], {
                    [style['building-item-active']]: v.id === active
                  })
                }

                key = { i }
              >
                { v.name }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const Sider = props => {
  const {
    active,
    onClick,
    data,
    onLoad
  } = props

  return (
    <div className = { style.sider }>
      <div className = { style['floor'] } ref = { el => onLoad(el) }>
        <div className = { style['floor-list'] }>
          {
            data.map((v, i) => (
              <div
                onClick = { e => { onClick(v, i, e) } }

                className = {
                  cs(style['floor-item'], {
                    [style['floor-item-active']]: v.id === active
                  })
                }

                key = { i }
              >
                { v.name }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const Content = props => {
  const {
    active,
    onClick,
    data,
    onLoad
  } = props

  return (
    <div className = { style.content } ref = { el => onLoad(el) }>
      <div className = { style['house'] }>
        <div className = { style['house-list'] }>
          {
            data.map((v, i) => (
              <div
                onClick = { e => { onClick(v, i, e) } }

                className = {
                  cs(style['house-item'], {
                    [style['house-item-active']]: v.id === active
                  })
                }

                key = { i }
              >
                { v.name }
              </div>
            ))
          }
        </div>
      </div>
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