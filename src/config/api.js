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
    getDetail: 'app/building/getBuldingDetail'
  },

  // 个人中心
  i: {
    // 关于
    about: 'app/my/aboutUs',
    getMessageList: 'app/sysMessage/sysMessageInfo',
    // 反馈
    feedback: 'app/my/feedbackInfo'
  },

  // 字典
  dict: {
    search: 'app/index/getSerch'
  }
}

export {
  url,
  api
}
