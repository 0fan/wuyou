import React from 'react'
import { createElement } from 'react'

import dynamic from 'util/dynamic'

let routerDataCache

function dynamicWrapper (component) {
  return dynamic(() => {
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
    component: dynamicWrapper(() => import('container/new_building/search/home'))
  },
  '/new_building/search/:word': {
    name: '搜索结果',
    component: dynamicWrapper(() => import('container/new_building/search/result'))
  },

  '/house': {
    name: '房屋',
    component: dynamicWrapper(() => import('container/house')),
    auth: true
  },

  '/building/:id': {
    name: '楼盘详情',
    component: dynamicWrapper(() => import('container/building'))
  },
  '/building/:id/track': {
    name: '追踪',
    component: dynamicWrapper(() => import('container/building/track'))
  },
  '/building/:id/track/protocol': {
    name: '追踪',
    component: dynamicWrapper(() => import('container/building/track/protocol')),
    hideMenu: true
  },
  '/building/:id/track/progress': {
    name: '追踪',
    component: dynamicWrapper(() => import('container/building/track/progress')),
    hideMenu: true
  },
  '/building/:id/detail': {
    name: '详情',
    component: dynamicWrapper(() => import('container/building/detail'))
  },
  '/building/:id/detail/home': {
    name: '详情',
    component: dynamicWrapper(() => import('container/building/detail/home')),
    hideMenu: true
  },
  '/building/:id/detail/dynamic': {
    name: '动态',
    component: dynamicWrapper(() => import('container/building/detail/dynamic')),
    hideMenu: true
  },
  '/building/:id/service': {
    name: '服务',
    component: dynamicWrapper(() => import('container/building/service')),
    hideMenu: true
  },

  '/service/appointment': {
    name: '预约看房',
    component: dynamicWrapper(() => import('container/service/appointment'))
  },
  '/service/loan_calculator': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator'))
  },
  '/service/loan_calculator/home': {
    name: '贷款计算器',
    component: dynamicWrapper(() => import('container/service/loan_calculator/home'))
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
    component: dynamicWrapper(() => import('container/service/tax_calculator'))
  },
  '/service/tax_calculator/home': {
    name: '税务计算器',
    component: dynamicWrapper(() => import('container/service/tax_calculator/home'))
  },
  '/service/tax_calculator/result': {
    name: '税务计算器',
    component: dynamicWrapper(() => import('container/service/tax_calculator/result'))
  },

  '/service/choice_house': {
    name: '在线选房',
    component: dynamicWrapper(() => import('container/service/choice_house'))
  },
  '/service/choice_house/certificate': {
    name: '存款证明',
    component: dynamicWrapper(() => import('container/service/choice_house/certificate'))
  },
  '/service/choice_house/certificate/home': {
    name: '存款证明',
    component: dynamicWrapper(() => import('container/service/choice_house/certificate/home'))
  },
  '/service/choice_house/certificate/:period': {
    name: '选择期数',
    component: dynamicWrapper(() => import('container/service/choice_house/certificate/period'))
  },
  '/service/choice_house/certificate/:period/home': {
    name: '选择期数',
    component: dynamicWrapper(() => import('container/service/choice_house/certificate/period/home'))
  },
  '/service/choice_house/certificate/:period/choice_house': {
    name: '选房',
    component: dynamicWrapper(() => import('container/service/choice_house/certificate/period/choice_house'))
  },
  '/service/choice_house/i': {
    name: '我的房源',
    component: dynamicWrapper(() => import('container/service/choice_house/i'))
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
    auth: true
  },
  '/i/setting': {
    name: '帐号设置',
    component: dynamicWrapper(() => import('container/i/setting')),
    auth: true
  },
  '/i/setting/home': {
    name: '帐号设置',
    component: dynamicWrapper(() => import('container/i/setting/home'))
  },
  '/i/setting/change_phome_bind': {
    name: '换绑手机号',
    component: dynamicWrapper(() => import('container/i/setting/change_phome_bind'))
  },
  '/i/auth': {
    name: '授权管理',
    component: dynamicWrapper(() => import('container/i/auth')),
    auth: true,
    hideMenu: true
  },
  '/i/feedback': {
    name: '反馈建议',
    component: dynamicWrapper(() => import('container/i/feedback'))
  },
  '/i/about': {
    name: '关于我们',
    component: dynamicWrapper(() => import('container/i/about'))
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