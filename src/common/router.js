import React from 'react'
import { createElement } from 'react'

import Loadable from 'react-loadable'

let routerDataCache

function dynamicWrapper (component) {
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData()
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      })
    }
  }

  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData()
      }

      return component().then(v => {
        const Component = v.default || v

        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache
        })
      })
    },
    loading: () => null
  })
}

const routerConfig = {
  '/': {
    component: dynamicWrapper(() => import('layout/basic_layout'))
  },

  '/login': {
    name: '登录',
    component: dynamicWrapper(() => import('container/login'))
  },

  '/login_only_phone': {
    name: '登录',
    component: dynamicWrapper(() => import('container/login_only_phone'))
  },

  '/phone_login': {
    name: '手机号码登录',
    component: dynamicWrapper(() => import('container/phone_login'))
  },

  '/bind_phone': {
    name: '绑定手机号码',
    component: dynamicWrapper(() => import('container/bind_phone'))
  },

  '/new_building': {
    name: '新盘',
    component: dynamicWrapper(() => import('container/new_building'))
  },
  '/new_building/home': {
    name: '新盘',
    component: dynamicWrapper(() => import('container/new_building/home'))
  },
  '/new_building/search': {
    name: '搜索',
    component: dynamicWrapper(() => import('container/new_building/search'))
  },
  '/new_building/search/home': {
    name: '搜索',
    component: dynamicWrapper(() => import('container/new_building/search/home')),
    hideMenu: true
  },
  '/new_building/search/:word': {
    name: '搜索结果',
    component: dynamicWrapper(() => import('container/new_building/search/result')),
    hideMenu: true
  },

  '/house': {
    name: '房屋',
    component: dynamicWrapper(() => import('container/house')),
    // auth: true
  },

  '/building/:id': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building'))
  },
  '/building/:id/track': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/track'))
  },
  '/building/:id/track/protocol': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/track/protocol')),
    hideMenu: true
  },
  '/building/:id/track/progress': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/track/progress'))
  },
  '/building/:id/detail': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/detail'))
  },
  '/building/:id/detail/home': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/detail/home'))
  },
  '/building/:id/detail/dynamic': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/detail/dynamic')),
    hideMenu: true
  },
  '/building/:id/service': {
    name: '楼盘',
    component: dynamicWrapper(() => import('container/building/service'))
  },

  '/service/appointment': {
    name: '预约看房',
    component: dynamicWrapper(() => import('container/service/appointment')),
    hideMenu: true
  },
  '/service/loan_calculator': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator')),
    hideMenu: true
  },
  '/service/loan_calculator/home': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator/home')),
    hideMenu: true
  },
  '/service/loan_calculator/common': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator/common')),
    hideMenu: true
  },
  '/service/loan_calculator/combine': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator/combine')),
    hideMenu: true,
  },
  '/service/loan_calculator/result': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator/result')),
    hideMenu: true,
    flex: true,
  },
  '/service/tax_calculator': {
    name: '税务计算器',
    component: dynamicWrapper(() => import('container/service/tax_calculator')),
    hideMenu: true
  },
  '/service/tax_calculator/home': {
    name: '税务计算器',
    component: dynamicWrapper(() => import('container/service/tax_calculator/home')),
    hideMenu: true,
    flex: true
  },
  '/service/tax_calculator/result': {
    name: '税务计算器',
    component: dynamicWrapper(() => import('container/service/tax_calculator/result')),
    hideMenu: true,
    flex: true
  },

  '/i': {
    name: '个人中心',
    component: dynamicWrapper(() => import('container/i'))
  },
  '/i/home': {
    name: '个人中心',
    component: dynamicWrapper(() => import('container/i/home'))
  },
  '/i/message': {
    name: '消息记录',
    component: dynamicWrapper(() => import('container/i/message')),
    auth: true,
    hideMenu: true
  },
  '/i/setting': {
    name: '帐号设置',
    component: dynamicWrapper(() => import('container/i/setting')),
    auth: true
  },
  '/i/setting/home': {
    name: '帐号设置',
    component: dynamicWrapper(() => import('container/i/setting/home')),
    hideMenu: true
  },
  '/i/setting/change_phome_bind': {
    name: '换绑手机号',
    component: dynamicWrapper(() => import('container/i/setting/change_phome_bind')),
    hideMenu: true
  },
  '/i/auth': {
    name: '授权管理',
    component: dynamicWrapper(() => import('container/i/auth')),
    auth: true,
    hideMenu: true
  },
  '/i/feedback': {
    name: '反馈建议',
    component: dynamicWrapper(() => import('container/i/feedback')),
    hideMenu: true
  },
  '/i/about': {
    name: '关于我们',
    component: dynamicWrapper(() => import('container/i/about')),
    hideMenu: true
  },

  // '/exception/403': {
  //   name: '没有权限',
  //   component: dynamicWrapper(() => import('container/exception/403'))
  // },
  // '/exception/404': {
  //   name: '找不到页面',
  //   component: dynamicWrapper(() => import('container/exception/404'))
  // },
  // '/exception/500': {
  //   name: '服务器错误',
  //   component: dynamicWrapper(() => import('container/exception/500'))
  // },
}

export const getRouterData = (isNest = false) => {
  return routerConfig
}