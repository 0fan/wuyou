const url = {
  // server: 'http://10.0.11.157:8080/',
  server: 'http://10.0.10.162:8080/',
}

const api = {
  getWechatCode: 'app/userLogin/getWechatCode',

  // 发送手机验证码
  sendCode: 'app/sendCode',
  // 绑定手机号码
  bindPhone: 'app/userLogin/addPhone',

  login: 'app/userLogin/login',

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
    getTrack: 'app/building/getPhoneIdentityInfo'
  },

  // 个人中心
  i: {
    // 获取我的房屋信息
    getHouseList: 'app/building/myBuilding',
    // 关于
    about: 'app/my/aboutUs',
    getMessageList: 'app/sysMessage/sysMessageInfo',
    // 反馈
    feedback: 'app/my/feedbackInfo'
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
