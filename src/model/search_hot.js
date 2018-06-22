import axios from 'axios'
import store from 'store'

import reduxGenerator from 'util/reduxGenerator'

import { url, api } from 'config/api'

const { server } = url
const { hot_search } = api.dict

export const {
  reducer,

  success,
  error,
  reset,

  loading,
  loaded
} = reduxGenerator({
  type: 'search_hot',

  state: {
    data: []
  }

})

export function getSearchHot () {
  return async (dispatch, getState) => {
    const store = getState()

    // 不能重复请求
    if (store.building.loading) {
      return ['不能重复请求']
    }

    // id相同就不重新获取数据啦
    if (store.search_hot.data.length) {
      return [null, store.search_hot]
    }

    dispatch(loading())

    const [err, res] = await axios.get(server + hot_search)

    dispatch(loaded())

    if (err) {
      dispatch(error(err))

      return [err]
    }

    dispatch(success({ }))

    return [null, res]
  }
}