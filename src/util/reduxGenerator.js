import _ from 'lodash'

export default ({
  type = '',
  state = {},
  reduxArr = [],
  auth = false,
}) => {
  const action_success = `${ type }_success`
  const action_error = `${ type }_error`
  const action_reset = `${ type }_reset`
  const action_loading = `${ type }_loading`
  const action_loaded = `${ type }_loaded`

  const initState = {
    loading: false,
    loadingMsg: '',

    msg: '',

    ...(auth ? { auth: false } : {}),

    ...state
  }

  if (_.isPlainObject(reduxArr)) {
    reduxArr = [reduxArr]
  }

  reduxArr = reduxArr
    .concat({
      action: action_success,
      result: (state, payload) => ({
        ...state,
        ...payload,

        ...(auth ? { auth: true } : {}),
        msg: ''
      })
    })
    .concat({
      action: action_error,
      result: (state, payload) => ({
        ...state,

        ...(auth ? { auth: false } : {}),
        msg: payload
      })
    })
    .concat({
      action: action_reset,
      result: (state, payload) => ({
        ...initState
      })
    })
    .concat({
      action: action_loading,
      result: (state, payload) => {
        if (state.loadingMsg === payload) {
          return {
            ...state
          }
        }

        return ({
          ...state,

          loading: true,
          loadingMsg: payload || '加载中'
        })
      }
    })
    .concat({
      action: action_loaded,
      result: (state, payload) => ({
        ...state,

        loading: false,
        loadingMsg: ''
      })
    })

  return {
    reducer: (state = initState, action) => {
      const { type, payload } = action

      for (let i = 0, len = reduxArr.length; i < len; i++) {
        if (type === reduxArr[i].action) {
          return reduxArr[i].result(state, payload)
        }
      }

      return state
    },
    success: (payload) => ({ payload, type: action_success }),
    error: (payload) => ({ payload, type: action_error }),
    reset: (payload) => ({ payload, type: action_reset }),
    loading: (payload) => ({ payload, type: action_loading }),
    loaded: (payload) => ({ payload, type: action_loaded }),
  }
}
