import React, { Component, Fragment } from 'react'
import axios from 'axios'
import cs from 'classnames'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import { Modal as AntdModal, Toast } from 'antd-mobile'
import Modal from 'component/modal'
import Alert from 'component/alert'
import BottomText from 'component/bottom-text'
import Empty from 'component/empty'

import Context from 'context/config'

import { url, api } from 'config/api'

import style from './index.less'

const { alert } = AntdModal

const { server } = url
const { getHouseList, lockHouse } = api.building

@connect(state => ({
  building: state.building
}))
class App extends Component {
  $building = null
  $floor = null
  $house = null

  isMount = true

  state = {
    visibleTip: false,

    activeBuilding: '',
    activeFloor: '',
    activeHouse: '',
    currentFloor: [],
    currentHouse: [],

    loading: false,
    msg: '',

    data: []
  }

  componentDidMount () {
    this.setState({ visibleTip: true })

    const {
      match: {
        url,
        params: {
          id: housePreiodId
        }
      },
      footerConfig,
      changeFooter,
      contentConfig,
      changeContent,
      building: {
        id
      }
    } = this.props

    console.log(id)

    if (!contentConfig.flex) {
      changeContent({ flex: true })
    }

    if (!footerConfig.length || footerConfig[0] && footerConfig[0].text !== '在线选房') {
      changeFooter([{
        type: 'building',
        to: `/service/choice_house/certificate/${ id }/home`,
        text: '在线选房'
      }, {
        type: 'i',
        to: '/service/choice_house/i',
        text: '我的房源'
      }])
    }

    this.getList(id, housePreiodId)
  }

  componentWillUnmount () {
    this.isMount = false
  }

  getList = async (id, housePreiodId) => {
    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.post(server + getHouseList, { id, housePreiodId })

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: <span>{ err || '获取房源列表失败' } <a href = 'javascript:;' onClick = { () => { this.getHouseList(id, housePreiodId) } }>重试</a></span> })

      return [err]
    }

    const {
      object = {}
    } = res

    let firstFloor   = object[0].buildNumId,
        firstHouse   = object[0].floorMessage[0].floor,
        currentFloor = object.find(v => v.buildNumId === firstFloor),
        currentHouse = currentFloor.floorMessage.find(v => v.floor === firstHouse)

    this.setState({
      data: object,
      currentFloor,
      currentHouse,
      activeBuilding: currentFloor.buildNumId,
      activeFloor: currentHouse.floor,
    })

    return [null, res]
  }

  handleBuildingClick = (v, i, e) => {
    const currentHouse = v.floorMessage[0]

    this.setState({
      activeBuilding: v.buildNumId,
      activeFloor: v.floorMessage[0].floor,
      activeHouse: '',
      currentFloor: v,
      currentHouse
    })

    this.$floor.scrollTop = 0
    this.$house.scrollTop = 0
  }

  handleFloorClick = (v, i, e) => {
    this.setState({
      activeHouse: '',
      activeFloor: v.floor,
      currentHouse: v
    })

    this.$house.scrollTop = 0
  }

  handleHouseClick = (v, i, e) => {
    const { houseNo, houseId } = v
    const {
      currentFloor: {
        buildNum,
        elementNum
      }, currentHouse: {
        floor
      }
    } = this.state

    this.setState({
      activeHouse: houseId
    })

    const alertInstance = alert('提示', `确定选择  ${ buildNum + '栋' + elementNum + '单元' } ${ floor + '楼' } ${ houseNo }房 吗?`, [
      { text: '再考虑下', style: 'default' },
      { text: '我确定', onPress: () => {
        this.handleLock(houseId)
      } },
    ])
  }

  handleLock = async (houseId) => {
    Toast.loading('锁定中...', 0, null, true)

    const {
      building: {
        certificateId,
        choiceHouseType
      }
    } = this.props

    const [err, res] = await axios.post(server + lockHouse, {
      identityOrderId: certificateId,
      type: choiceHouseType,
      houseId
    })

    Toast.hide()

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      Toast.fail(err || '锁定失败', 2, null, false)

      return [err]
    }

    Toast.success('锁定成功', 3, () => {
      this.props.history.push('/service/choice_house/i')
    }, false)

    return [null, res]
  }

  render () {
    const {
      activeBuilding,
      activeFloor,
      activeHouse,
      currentFloor,
      currentHouse,
      data,
      loading,
      msg
    } = this.state

    const { choiceHouseType } = this.props.building

    return (
      <Fragment>
        {
          loading ?
            <BottomText><Spin /></BottomText> :
            <Layout>
              <Alert message = { msg } fixed />
              <Header
                active = { activeBuilding }
                data = { data }
                onClick = { this.handleBuildingClick }
                onLoad = { el => this.$building = el }
              />
              <Layout hasSider>
                <Sider
                  active = { activeFloor }
                  data = { currentFloor.floorMessage ? currentFloor.floorMessage : [] }
                  onClick = { this.handleFloorClick }
                  onLoad = { el => this.$floor = el }
                />
                <Content
                  active = { activeHouse }
                  data = { currentHouse.houseMessage ? currentHouse.houseMessage : [] }
                  onClick = { this.handleHouseClick }
                  onLoad = { el => this.$house = el }
                  choiceHouseType = { choiceHouseType }
                />
              </Layout>
            </Layout>
        }
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
                    [style['building-item-active']]: v.buildNumId === active
                  })
                }

                key = { i }
              >
                { v.buildNum ? `${ v.buildNum }栋` : null } { v.elementNum ? `${ v.elementNum }单元` : null }
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
                    [style['floor-item-active']]: v.floor === active
                  })
                }

                key = { i }
              >
                { v.floor ? `${ v.floor }楼` : null }
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
    onLoad,
    choiceHouseType
  } = props

  return (
    <div className = { style.content } ref = { el => onLoad(el) }>
      <div className = { style['house'] }>
        <div className = { style['house-list'] }>
          {
            choiceHouseType === 0 ?
              data.map((v, i) => (
                parseInt(v.status) === 1 ?
                  <div
                    onClick = { e => { onClick(v, i, e) } }

                    className = {
                      cs(style['house-item'], {
                        [style['house-item-active']]: v.houseId === active
                      })
                    }

                    key = { i }
                  >
                    { v.houseNo ? v.houseNo : null }
                  </div> :
                  <div
                    className = {
                      cs(style['house-item'], style['house-item-disabled'])
                    }

                    key = { i }
                  >
                    { v.houseNo ? v.houseNo : null }
                  </div>
              )) :
              data.map((v, i) => (
                parseInt(v.statusSelect) === 1 ?
                  <div
                    onClick = { e => { onClick(v, i, e) } }

                    className = {
                      cs(style['house-item'], {
                        [style['house-item-active']]: v.houseId === active
                      })
                    }

                    key = { i }
                  >
                    { v.houseNo ? v.houseNo : null }
                  </div> :
                  <div
                    className = {
                      cs(style['house-item'], [style['house-item-active']])
                    }

                    key = { i }
                  >
                    { v.houseNo ? v.houseNo : null }
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