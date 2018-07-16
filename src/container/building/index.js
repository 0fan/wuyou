import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import cs from 'classnames'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Modal as AntdModal, Toast } from 'antd-mobile'

import LinkTabs from 'component/link_tabs'
import Image from 'component/image'
import Alert from 'component/alert'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

import { getBuilding  } from 'model/building'

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
    focus: '',
    building: '',
    price: '',
    tag: [],
    preSalePermit: false
  }

  componentDidMount () {
    const { id } = this.props.match.params

    this.props.getBuilding(id)
  }

  componentWillUnmount () {
    this.isMount = false
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
      backgroundImg
    } = this.props.building

    return (
      <Fragment>
        <Alert message = { msg } />
        <Focus src = { !loading && !backgroundImg ? require('component/empty/img/404.png') : backgroundImg  } noSrc = { !loading && !backgroundImg } />
        <Panel
          title = { buildingName }
          tag = { buildingTag ? buildingTag.split(',').filter(v => v) : [] }
          price = { amount }
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
      </Fragment>
    )
  }
}

const Focus = props => {
  const {
    src,
    noSrc,

    ...rest
  } = props

  return (
    <div className = { cs(style.focus, { [style['focus-404']]: noSrc }) } { ...rest }>
      {
        src ?
          <img
            src = { src }

            { ...rest }
          /> :
          null
      }
      <span className = { style['pre-sale-permit'] }>预售证&nbsp;&nbsp;<img src = { require('./img/pre_sale_permit.png') } /></span>
    </div>
  )
}

const Panel = props => {
  const {
    title,
    tag = [],
    price,

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
        <div className = { style['panel-price'] }>
          <span className = { style['panel-price-title'] }>参考价</span>
          <span className = { style['panel-price-value'] }>
            {
              price ?
                price + '元/平' :
                '未知'
            }
          </span>
        </div>
      </div>
    </div>
  )
}