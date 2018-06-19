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
    // 楼盘id
    id: '',
    // 标签
    tag: [],
    // 价格
    price: '',
    // 区域
    area: '',
    // 经度
    longitude: '',
    // 维度
    latitude: '',

    // 动态
    dynamic: [],
    // 图集
    atlas: [],
    // 户型
    houseType: []
  }

})

export function getBuilding (buildingId) {
  return async (dispatch, getState) => {
    const store = getState().building

    console.log(store)

    if (!buildingId) {
      return ['没有传递buildingId']
    }

    if (store.loading) {
      return ['重复获取']
    }

    if (store.id && buildingId === store.id) {
      return [null, getState().building]
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
      latitude,
      longitude,
      type,
      id,
      area,
      renews,
      tag,
      price,
      backgroundImg,
      buildingName,
      buildingType,
    } = res.object

    dispatch(success({
      id: id.toString()
    }))

    return [null, res]
  }
}