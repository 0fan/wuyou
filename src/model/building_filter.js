
import { commonReduxGenerator } from 'util/reduxGenerator/index'
import axios from 'axios'

import { url, api } from 'config/api'

export const {
  reducer,

  success,
  error,
  reset,
  loading,
  loaded,
  storeQuery
} = commonReduxGenerator({
  type: 'building_filter',

  state: {
    data: []
  }
})

export function getBuildingFilter (params = {}, ignoreCache) {
  return async (dispatch, getState) => {
    const {
      building_filter: {
        loading: _loading,
        msg,
        init,
        data
      }
    } = getState()

    if (_loading) {
      return ['重复请求']
    }

    if (init && !ignoreCache) {
      return [null, data]
    }

    dispatch(loading())

    const [err, res] = await axios.get(url.server + api.dict.building_filter, {
      params
    })

    dispatch(loaded())

    if (err) {
      dispatch(error(err))

      return [err]
    }

    const { object } = res

    const keys = Object.keys(object)

    let result = {}

    keys.forEach((key, i) => {
      let label = ''

      switch (key) {
        case 'area':
          label = '区域'
          break
        case 'layOut':
          label = '户型'
          break
        case 'price':
          label = '价格'
          break
        case 'type':
          label = '类型'
          break
      }

      result[key] = [{
        label: `不限${ label }`,
        value: ''
      }]
    })

    keys.map((key, i) => {
      object[key].map((_v, _i) => {
        result[key].push({
          value: _v,
          label: _v
        })
      })
    })

    dispatch(success({
      data: result
    }))

    return [null, result]
  }
}
