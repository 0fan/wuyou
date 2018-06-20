import axios from 'axios'
import store from 'store'

import reduxGenerator from 'util/reduxGenerator'

import { url, api } from 'config/api'

const { server } = url
const { getDetail } = api.building

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
    buildingType: []
  }

})

export function getBuilding (buildingId) {
  return async (dispatch, getState) => {
    const store = getState().building

    // 需要id
    if (!buildingId) {
      return ['没有传递buildingId']
    }

    // 不能重复请求
    if (store.loading) {
      return ['不能重复请求']
    }

    // id相同就不重新获取数据啦
    if (store.id && buildingId === store.id) {
      return [null, store]
    }

    // 重置之前的数据
    dispatch(loading())

    const [err, res] = await axios.post(server + getDetail, { id: buildingId })

    dispatch(loaded())

    if (err) {
      dispatch(error())

      return [err]
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
      buildingType
    }))

    return [null, res]
  }
}