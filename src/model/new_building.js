import _ from 'lodash'
import axios from 'axios'

import { url, api } from 'config/api'

const initState = {
  flash: {
    loading: false,
    init: false,
    msg: '',
    data: []
  },
  new: {
    loading: false,
    init: false,
    msg: '',
    data: {}
  },
  data: {
    query: {
      buildingName: '',
      area: '',
      type: '',
      // omit
      price: '',
      minPrice: '',
      maxPrice: '',
      layOut: '',
      currentPage: 1,
    },

    loading: false,
    init: false,
    msg: '',

    data: [],
    isEnd: false,
  }
}

const new_building_flash_loading = 'new_building_flash_loading'
const new_building_flash_loaded = 'new_building_flash_loaded'
const new_building_flash_error = 'new_building_flash_error'
const new_building_flash_success = 'new_building_flash_success'

const new_building_new_loading = 'new_building_new_loading'
const new_building_new_loaded = 'new_building_new_loaded'
const new_building_new_error = 'new_building_new_error'
const new_building_new_success = 'new_building_new_success'

const new_building_data_loading = 'new_building_data_loading'
const new_building_data_loaded = 'new_building_data_loaded'
const new_building_data_error = 'new_building_data_error'
const new_building_data_success = 'new_building_data_success'

export function reducer (state = initState, {
  type,
  payload
}) {
  switch (type) {
    case new_building_flash_loading:
      return {
        ...state,
        flash: { ...state.flash, loading: true }
      }
    case new_building_flash_loaded:
      return {
        ...state,
        flash: { ...state.flash, loading: false }
      }
    case new_building_flash_error:
      return {
        ...state,
        flash: { ...state.flash, msg: payload }
      }
    case new_building_flash_success:
      return {
        ...state,
        flash: { ...state.flash, ...payload, init: true }
      }

    case new_building_new_loading:
      return {
        ...state,
        new: { ...state.new, loading: true }
      }
    case new_building_new_loaded:
      return {
        ...state,
        new: { ...state.new, loading: false }
      }
    case new_building_new_error:
      return {
        ...state,
        new: { ...state.new, msg: payload }
      }
    case new_building_new_success:
      return {
        ...state,
        new: { ...state.new, ...payload, init: true }
      }

    case new_building_data_loading:
      return {
        ...state,
        data: { ...state.data, loading: true }
      }
    case new_building_data_loaded:
      return {
        ...state,
        data: { ...state.data, loading: false }
      }
    case new_building_data_error:
      return {
        ...state,
        data: { ...state.data, msg: payload }
      }
    case new_building_data_success:
      return {
        ...state,
        data: { ...state.data, ...payload, init: true }
      }

    default:
      return state
  }
}

export function getFlash (params = {}, ignoreCache) {
  return async (dispatch, getState) => {
    const {
      new_building: {
        flash: {
          loading,
          msg,
          init,
          data
        }
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    if (init && !ignoreCache) {
      return [null, data]
    }

    dispatch({ type: new_building_flash_loading })

    const [err, res] = await axios.get(url.server + api.new_building.getFlash, {
      params
    })

    dispatch({ type: new_building_flash_loaded })

    if (err) {
      dispatch({
        payload: err,
        type: new_building_flash_error
      })

      return [err]
    }

    const {
      object = []
    } = res

    const result = object.map(v => ({
      src: getLink(v.imgPath),
      title: v.title,
      href: getLink(v.buttonLinkHref),
    }))

    dispatch({
      payload: {
        data: result
      },
      type: new_building_flash_success
    })

    return [null, result]
  }
}

export function getNewBuilding (params = {}, ignoreCache) {
  return async (dispatch, getState) => {
    const {
      new_building: {
        new: {
          loading,
          msg,
          init,
          data
        }
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    if (init && !ignoreCache) {
      return [null, data]
    }

    dispatch({ type: new_building_new_loading })

    const [err, res] = await axios.get(url.server + api.new_building.getNewBuildingList, {
      params
    })

    dispatch({ type: new_building_new_loaded })

    if (err) {
      dispatch({
        payload: err,
        type: new_building_new_error
      })

      return [err]
    }

    const {
      object = []
    } = res

    let result = new Object()

    object.forEach(v => {
      Object.assign(result, v)
    })

    dispatch({
      payload: {
        data: result
      },
      type: new_building_new_success
    })

    return [null, result]
  }
}

export function getBuilding (params = {}, ignoreCache, isFilter) {
  return async (dispatch, getState) => {
    const {
      new_building: {
        data: {
          loading,
          msg,
          init,
          query,
          data
        }
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    if (
      init &&
      !ignoreCache
    ) {
      return [null, data]
    }

    dispatch({ type: new_building_data_loading })

    const {
      price = '',
      ...rest
    } = params

    let minPrice = ''
    let maxPrice = ''

    // 魔性的处理
    if (/以上$/g.test(price)) {
      minPrice = parseFloat(price)
    } else if (/以下$/g.test(price)) {
      maxPrice = parseFloat(price)
    } else {
      const range = price.split('-').filter(v => v.length)

      if (range.length) {
        minPrice = parseFloat(range[0])
        maxPrice = parseFloat(range[1])
      }
    }

    const [err, res] = await axios.post(url.server + api.new_building.getBuildingList, {
      ...query,
      ...rest,

      minPrice,
      maxPrice
    })

    dispatch({ type: new_building_data_loaded })

    if (err) {
      dispatch({
        payload: err,
        type: new_building_data_error
      })

      return [err]
    }

    const {
      object = []
    } = res

    dispatch({
      payload: {
        data: isFilter ? object : data.concat(object),
        isEnd: object.length < 5,

        query: {
          ...query,
          ...params,
          currentPage: isFilter ? 1 : query.currentPage + 1
        }
      },
      type: new_building_data_success
    })

    return [null, object]
  }
}

function getLink (v) {
  if (!v) {
    return ''
  }

  return (
    /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(v) ?
      v :
      url.server + v
  )
}