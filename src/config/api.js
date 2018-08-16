const url = {
  // server: 'http://10.0.11.157:8080/',
  // server: 'http://10.0.10.162:8080/',
  server: 'https://test.1m2.net/',
  // server: 'http://zfwyconsole.gyfc.net.cn/',
}

const api = {
  getWechatCode: 'app/userLogin/getWechatCode',

  // 发送手机验证码
  sendCode: 'app/sendCode',
  // 绑定手机号码
  bindPhone: 'app/userLogin/addPhone',

  login: 'app/userLogin/login',
  loginByPhone: 'app/userLogin/loginByPhone',

  // 首页接口
  new_building: {
    getFlash: 'app/index/head-adv',
    getNewBuildingList: 'app/index/newBuilding',
    getBuildingList: 'app/index/getBuilding'
  },

  // 楼盘相关接口
  building: {
    getDetail: 'app/building/getBuldingDetail',
    // 登录后才可以调用
    // 获取存款证明和开盘信息
    getTrack: 'app/building/getPhoneIdentityInfo',
    // 获取其他信息（网签等）
    getOtherInfo: 'app/gy/getAllMsg',
    // 授权/取消授权
    auth: 'app/my/authorization',

    // 选房
    // 根据楼盘ID获取所有的期数信息
    getPeriod: 'app/building/getBuldingStaging',
    // 根据楼盘ID和期数获取所有房源
    getHouseList: 'app/building/findBuildIDAndPeriodIdUnit',
    // 锁定房源/预选房源
    lockHouse: 'app/order/executeLock',
    // 获取我锁定的房源
    getMyLockList: 'app/building/getHousesByCustomerPhone',
    // 锁定我的房源里面的预选房源
    lockPrimaryHouse: 'app/order/executeReserbeToLock',
    // 移除订单
    deleteHouseOrder: 'app/order/houseOrderDelete'
  },

  // 个人中心
  i: {
    // 获取我的房屋信息
    getHouseList: 'app/building/myBuilding',
    // 关于
    about: 'app/my/aboutUs',
    getMessageList: 'app/sysMessage/sysMessageInfo',
    // 反馈
    feedback: 'app/my/feedbackInfo',
    // 获取授权列表
    getAuthList: 'app/my/getAuthorization'
  },

  // 字典
  dict: {
    building_filter: 'app/index/getSerch',
    // 热门搜索标签
    hot_search: 'app/common/getHotCode'
  }
}

export {
  url,
  api
}
