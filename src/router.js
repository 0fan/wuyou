{
  // 登录
  '/login',
  // 绑定手机号码
  '/bind_phone',

  // 新盘
  '/new_building',
  // 搜索
  'new_building/search',
  // 搜索结果
  'new_building/search/:word',
  
  // 房屋
  '/house',

  // 楼盘详情
  '/building/:id',
  // 追踪
  '/building/:id/track',
  // 详情
  '/building/:id/detail',
  // 服务
  '/building/:id/service',
  // 预约看房
  '/building/:id/service/appointment',
  // 贷款计算器
  '/building/:id/service/loan_calculator',
  // 税务计算器
  '/building/:id/service/tax_calculator',
  // 在线选房
  '/building/:id/service/choice_house',
  // 在线选房 存款证明
  '/building/:id/service/choice_house/certificate',
  // 在线选房 存款证明 选择期数
  '/building/:id/service/choice_house/certificate/:period',
  // 在线选房 存款证明 选择期数 选房
  '/building/:id/service/choice_house/certificate/:period/choice_house',
  // 在线选房 我的房源
  '/building/:id/service/choice_house/i',

  '/service/appointment',
  
  // 我的
  '/i',
  // 消息记录
  '/i/message',
  // 帐号设置
  '/i/setting',
  '/i/setting/change_phome_bind',
  // 授权管理
  '/i/auth',
  // 反馈建议
  '/i/feedback',
  // 关于我们
  '/i/about',
  
  // 没有权限
  '/exception/403',
  // 找不到页面
  '/exception/404',
  // 服务器错误
  '/exception/500'
}