import axios from 'axios'
import store from 'store'

import reduxGenerator from 'util/reduxGenerator'

import { url, api } from 'config/api'

const { server } = url
const { getDetail, getTrack: getTrackApi } = api.building

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
    certificate: [],
    // 开盘信息
    openmap: null
  }

})

export function getBuilding (buildingId) {
  return async (dispatch, getState) => {
    const store = getState()
    const { auth } = store.user

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
    let trackErr, trackRes

    // 如果用户已登录,还需要请求其他信息
    if (auth) {
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

    const {
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

      renews = [],
      jcvImgArrayMobie = '',
      buildingType = []
    } = res.object

    const {
      // 存款证明列表
      identitys: certificate = [],
      // 开盘信息
      openmap,
    } = trackRes.object

    dispatch(success({
      id: id.toString(),
      latitude,
      longitude,
      type,
      amount,
      area,
      backgroundImg,
      buildingName,
      buildingTag,

      renews,
      atlas: jcvImgArrayMobie.split(',').filter(v => v),
      buildingType,

      certificate,
      openmap
    }))

    return [null, res]
  }
}

// 获取存款证明和开盘信息,只有在登录后才能调用
async function getTrack (buildingId) {
  const [err, res] = await axios.post(server + getTrackApi, { id: buildingId })

  if (err) {
    return [err]
  }

  return [null, res]
}