import axios from 'axios'
import store from 'store'

import reduxGenerator from 'util/reduxGenerator'

import { url, api } from 'config/api'

const { server } = url
const { getDetail, getOtherInfo: getOtherInfoApi, getTrack: getTrackApi } = api.building

const building_authorization = 'building_authorization'
const building_dis_authorization = 'building_dis_authorization'
const change_certificateId = 'change_certificateId'
const change_choiceHouseType = 'change_choiceHouseType'

export const {
  reducer,

  success,
  error,
  reset,

  loading,
  loaded
} = reduxGenerator({
  type: 'building',

  state: {
    id: '',
    // 纬度
    latitude: '',
    // 经度
    longitude: '',
    // 类型
    type: '',
    // 楼盘价格
    amount: '',
    // 区域
    area: '',
    // 背景图
    backgroundImg: '',
    // 楼盘名称
    buildingName: '',
    // 楼盘标签
    buildingTag: '',

    // 列表数据
    // 动态
    renews: [],
    // 图集
    atlas: [],
    // 户型图列表
    buildingType: [],

    // 登录后才有的信息
    // 为什么放在楼盘里而不放在user里呢,因为每个楼盘都是单独的一个进度
    // 存款证明信息
    certificate: [],
    // 被选中的存款证明ID
    certificateId: '',
    // 选中房源的方式 0:立即选房/ 1:预选房源
    choiceHouseType: 0,
    // 预选房源的套数
    hobPreNum: 0,
    // 开盘信息
    open: {},
    // 网签信息
    sign: [],
    // 购房备案
    record: [],
    // 房产证
    property: [],

    // 是否已签约
    authorization: true
  },

  reduxArr: [{
    action: building_authorization,
    result: (state, payload) => ({
      ...state,
      authorization: true
    })
  }, {
    action: building_dis_authorization,
    result: (state, payload) => ({
      ...state,
      authorization: false
    })
  }, {
    action: change_certificateId,
    result: (state, payload) => ({
      ...state,
      certificateId: payload
    })
  }, {
    action: change_choiceHouseType,
    result: (state, payload) => ({
      ...state,
      choiceHouseType: payload
    })
  }]

})

export function getBuilding (buildingId) {
  return async (dispatch, getState) => {
    const store = getState()
    const { auth, userType } = store.user

    // 需要id
    if (!buildingId) {
      return ['没有传递buildingId']
    }

    // 不能重复请求
    if (store.building.loading) {
      return ['不能重复请求']
    }

    // id相同就不重新获取数据啦
    if (store.building.id && buildingId === store.building.id) {
      return [null, store.building]
    }

    // 重置之前的数据
    dispatch(loading())

    const [err, res] = await axios.post(server + getDetail, { id: buildingId })

    let trackErr,
        trackRes = {},
        otherErr,
        otherRes = {}

    // 如果用户已登录且是B类用户,还需要请求其他信息
    if (auth && userType === '0') {
      [trackErr, trackRes] = await getTrack(buildingId)
    }

    dispatch(loaded())

    if (err) {
      dispatch(error(err))

      return [err]
    }

    if (trackErr) {
      dispatch(error(trackErr))

      return [trackErr]
    }

    if (auth && userType === '0') {
      [otherErr, otherRes] = await getOtherInfo(buildingId, trackRes.certificate[0].identityCard)
    }

    if (otherErr) {
      dispatch(error(otherErr))

      return [otherErr]
    }

    const {
      // 是否已授权
      // '0' 没有
      // '1' 已授权
      authorization,
      id,
      // 纬度
      latitude,
      // 经度
      longitude,
      // 类型
      type,
      // 楼盘价格
      amount,
      // 区域
      area,
      // 背景图
      backgroundImg,
      // 楼盘名称
      buildingName,
      // 楼盘标签
      buildingTag,
      // 预售证
      presell = [],

      renews = [],
      jcvImgArrayMobie = '',
      buildingType = []
    } = res.object

    dispatch(success({
      id: id.toString(),

      authorization: authorization === '1',

      latitude,
      longitude,
      type,
      amount,
      area,
      backgroundImg,
      buildingName,
      buildingTag,
      presell,

      renews,
      atlas: jcvImgArrayMobie.split(',').filter(v => v),
      buildingType,

      ...trackRes,
      ...otherRes
    }))

    return [null, res]
  }
}

// 获取追踪信息
// 比如存款证明和开盘信息
// 只有在登录后才能调用
async function getTrack (buildingId) {
  const [err, res] = await axios.post(server + getTrackApi, { id: buildingId })

  if (err) {
    return [err]
  }

  const {
    identitys: certificate = [],
    openmap: open
  } = res.object

  return [null, {
    certificate,
    certificateId: certificate.length ? certificate[0].idtityId : '',
    open
  }]
}

// 网签信息
// 备案信息
// 房产证信息
async function getOtherInfo (buildingId, identifyId) {
  const [err, res] = await axios.post(server + getOtherInfoApi, { projectId: '1708081657220113', certificateNumber: '522525197312039386' })

  if (err) {
    return [err]
  }

  const {
    record = [],
    propertyHandle: property = [],
    net: sign = []
  } = res.object

  return [null, {
    record,
    property,
    sign
  }]
}

export function buildingAuthorization (payload) {
  return {
    payload,
    type: building_authorization
  }
}

export function buildingDisAuthorization (payload) {
  return {
    payload,
    type: building_dis_authorization
  }
}