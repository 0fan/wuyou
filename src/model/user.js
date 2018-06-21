import axios from 'axios'
import store from 'store'

import reduxGenerator from 'util/reduxGenerator'
import { url, api } from 'config/api'

const update_phone = 'update_phone'

export const {
  reducer,

  success,
  error,
  reset,

  loading,
  loaded
} = reduxGenerator({
  type: 'user',

  state: {
    token: '',

    id: '',
    wechatId: '',

    userType: '',

    name: '',
    nickName: '',
    headPhoto: '',
    // 性别
    // 1 男
    // 2 女
    // 0 未知
    sex: '',
    idCardNo: '',
    phone: ''
  },

  auth: true,

  reduxArr: [{
    action: update_phone,
    result: (state, payload) => ({
      ...state,
      phone: payload
    })
  }]

})

export function updatePhone (payload) {
  return dispatch => {
    dispatch({
      payload,
      type: update_phone
    })

    const user = store.get('user')

    if (user) {
      store.set('user', {
        ...user,
        phone: payload
      })
    }
  }
}

export function logout (cb) {
  return dispatch => {
    dispatch(reset())

    store.remove('user')
    axios.defaults.headers.common['token'] = undefined

    cb instanceof Function && cb()
  }
}