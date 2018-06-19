import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Toast } from 'antd-mobile'
import DocumentTitle from 'react-document-title'
import { AuthRouter } from 'component/auth'
import Layout from 'component/layout'

import Context from 'context/config'

import pathToRegexp from 'path-to-regexp'
import { getRoutes } from 'util/getRoutes'

const {
  Content,
  Footer
} = Layout

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      contentConfig: {
        grey: true,
        flex: false
      },
      changeContent: v => {
        this.setState(prevState => ({
          ...prevState,
          contentConfig: {
            ...prevState.contentConfig,
            ...v
          }
        }))
      },

      footerConfig: this.getFooter(props.user.auth),
      changeFooter: v => {
        this.setState({ footerConfig: v })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user.auth !== nextProps.user.auth) {
      this.setState({
        footerConfig: this.getFooter(nextProps.user.auth)
      })
    }
  }

  getFooter = (auth) => {
    if (auth) {
      return [{
        type: 'house',
        to: '/house',
        text: '房屋'
      }, {
        type: 'i',
        to: '/i',
        text: '我的'
      }]
    }

    return [{
      type: 'building',
      to: '/new_building',
      text: '新盘'
    }, {
      type: 'i',
      to: '/i',
      text: '我的'
    }]
  }

  renderFooter = () => {
    const { footerConfig } = this.state

    if (footerConfig && footerConfig.length) {
      return (
        <Footer>
          {
            footerConfig.map((v, i) => (
              <Footer.Menu
                type = { v.type }
                to = { v.to || '/' }
                text = { v.text }

                key = { i }
              />
            ))
          }
        </Footer>
      )
    }

    return null
  }

  getRedirect = () => {
    const { auth } = this.props.user

    return auth ? '/house' : '/new_building'
  }

  // 如果已登录且未绑定手机号码则必须绑定手机号码才能进行操作
  renderRedirectToBindPhone = () => {
    const {
      phone,
      auth,
    } = this.props.user

    if (auth && !phone) {
      Toast.info('必须绑定手机号码才能进行操作', 3, null, false)

      return <Redirect to = '/bind_phone' />
    }

    return null
  }

  render () {
    const {
      routerData,
      match: {
        path
      }
    } = this.props

    const renderFooter = this.renderFooter()

    return (
      <DocumentTitle title = 'hello world'>
        <Context.Provider
          value = { {
            contentConfig: this.state.contentConfig,
            changeContent: this.state.changeContent,
            footerConfig: this.state.footerConfig,
            changeFooter: this.state.changeFooter
          } }
        >
          <Layout fixed>
            <Content
              { ...this.state.contentConfig }
            >
              <Switch>
                { this.renderRedirectToBindPhone() }
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
                <Redirect exact from = '/' to = { this.getRedirect() } />
              </Switch>
            </Content>
            { renderFooter }
          </Layout>
        </Context.Provider>
      </DocumentTitle>
    )
  }
}