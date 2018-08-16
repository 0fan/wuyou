import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import cs from 'classnames'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Modal as AntdModal, Toast } from 'antd-mobile'

import store from 'store'

import LinkTabs from 'component/link_tabs'
import Image from 'component/image'
import Alert from 'component/alert'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

import { getBuilding } from 'model/building'

import style from './index.less'

@connect(state => ({
  user: state.user,
  building: state.building
}), {
  getBuilding
})
export default class App extends Component {
  isMount = true

  state = {
    visiblePermit: false,
    focus: '',
    building: '',
    price: '',
    tag: []
  }

  componentDidMount () {
    const { id } = this.props.match.params

    this.props.getBuilding(id)
  }

  componentWillUnmount () {
    this.isMount = false
  }

  handleSeePermit = () => {
    this.setState({
      visiblePermit: true
    })
  }

  render () {
    const {
      routerData,
      match: {
        url,
        path
      }
    } = this.props

    const {
      loading,
      msg,
      buildingName,
      buildingTag,
      amount,
      backgroundImg,
      presell
    } = this.props.building

    return (
      <Fragment>
        <Alert message = { msg } />
        <Focus
          src = { !loading && !backgroundImg ? require('component/empty/img/404.png') : backgroundImg  }
          noSrc = { !loading && !backgroundImg }
          onClick = { this.handleSeePermit }
        />
        <Panel
          title = { buildingName }
          tag = { buildingTag ? buildingTag.split(',').filter(v => v) : [] }
          price = { amount }
          presell = { presell }
        />
        <LinkTabs
          tabs = {
            [{
              to: `${ url }/track`,
              title: '购房跟踪'
            }, {
              to: `${ url }/detail`,
              title: '楼盘详情'
            }, {
              to: `${ url }/service`,
              title: '楼盘服务'
            }]
          }
        />
        <Switch>
          {
            getRoutes(path, routerData).map((v, i) => (
              <AuthRouter
                auth = { v.auth }

                component = { v.component }

                path = { v.path }
                exact = { v.exact }

                redirectPath = '/login'

                key = { v.key }
              />
            ))
          }
          <Redirect exact from = { url } to = { `${ url.removelastSlash() }/track` } />
        </Switch>
        <AntdModal
          visible = { this.state.visiblePermit }
          transparent
          maskClosable = { false }
          onClose = { () => this.setState({ visiblePermit: false }) }
          title = '预售许可证'
          style = { { width: 290 } }
          footer = { [{ text: '确定', onPress: () => { this.setState({ visiblePermit: false }) } }] }
        >
          {
            presell && presell.length ?
              <div className = { style['presell'] }>
                <ul>
                  {
                    presell.map((v, i) => (
                      <li key = { i }>
                        <div
                          className = { style['presell-item'] }
                        >
                          <Image
                            src = { v.ImageUrl }
                          />
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div> :
              <div>正在办理中</div>
          }
        </AntdModal>
      </Fragment>
    )
  }
}

const Focus = props => {
  const {
    src,
    noSrc,
    onClick,

    ...rest
  } = props

  return (
    <div className = { cs(style.focus, { [style['focus-404']]: noSrc }) } { ...rest }>
      {
        src ?
          <Image
            src = { src }
            isZoom = { false }

            { ...rest }
          /> :
          null
      }
      <span onClick = { onClick } className = { style['pre-sale-permit'] }>
      </span>
    </div>
  )
}

const Panel = props => {
  const {
    title,
    tag = [],
    price,
    presell,

    children,

    ...rest
  } = props

  return (
    <div className = { style.panel }>
      <div className = { style['panel-content'] }>
        <div className = { style['panel-title'] }>{ title }</div>
        {
          tag.length ?
            <div className = { style['panel-tag-wrap'] }>
              {
                tag.map((v, i) => (
                  <div className = { style['panel-tag'] } key = { i }>{ v }</div>
                ))
              }
            </div> :
            null
        }
      </div>
      <div className = { style['panel-right'] }>
        {/* <div className = { style['panel-price'] }>
          <span className = { style['panel-price-title'] }>参考价</span>
          <span className = { style['panel-price-value'] }>
            {
              !price || price.toString() === '0' ?
                '暂无价格' :
                price + '元/平'

            }
          </span>
        </div> */}
      </div>
    </div>
  )
}