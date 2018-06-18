import React, { Component, Fragment } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import LinkTabs from 'component/link_tabs'
import Image from 'component/image'

import { AuthRouter } from 'component/auth'
import { getRoutes } from 'util/getRoutes'

import Context from 'context/config'

import style from './index.less'

class App extends Component {
  componentDidMount () {
    const {
      footerConfig,
      changeFooter
    } = this.props

    if (footerConfig.length) {
      changeFooter([])
    }
  }

  render () {
    const {
      routerData,
      match: {
        url,
        path
      }
    } = this.props

    return (
      <Fragment>
        <Focus src = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=454443111,856819310&fm=200&gp=0.jpg' />
        <Panel
          title = '融创九樾府'
          tag = { ['观山湖区', '高层'] }
          price = '10,000元/平'
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

    ...rest
  } = props

  return (
    <div className = { style.focus } { ...rest }>
      <Image
        src = { src }
        { ...rest }
      />
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
          <span className = { style['panel-price-value'] }>{ price }</span>
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