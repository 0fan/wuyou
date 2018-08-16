import React from 'react'
import { render } from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import getUserData from 'config/store'
import axiosConfig from 'config/axios'
import 'config/method'

import vConsole from 'vconsole'

import App from './app'

import reducer from 'model/index'

import 'less/index.less'

const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

axiosConfig(store)
// getUserData(store)

// new vConsole()

render(
  <Provider store = { store }>
    <LocaleProvider locale = { zh_CN }>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
)