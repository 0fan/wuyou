import _ from 'lodash'

export default ({
  type = '',
  state = {},
  action = [],
  auth = false,
}) => {
  const action_success = `${ type }_success`
  const action_error = `${ type }_error`
  const action_reset = `${ type }_reset`
  const action_loading = `${ type }_loading`
  const action_loaded = `${ type }_loaded`
  const action_store_query = `${ type }_lstore_query`

  const initState = {
    loading: false,
    init: false,
    msg: '',

    ...(auth ? { auth: false } : {}),

    ...state
  }

  if (_.isPlainObject(action)) {
    action = [action]
  }

  action = action.concat([{
    action: action_success,
    result: (state, payload) => ({
      ...state,
      ...payload,

      ...(auth ? { auth: true } : {}),
      init: true,
      msg: ''
    })
  }, {
    action: action_error,
    result: (state, payload) => ({
      ...state,

      ...(auth ? { auth: false } : {}),
      msg: payload
    })
  }, {
    action: action_reset,
    result: (state, payload) => ({
      ...initState
    })
  }, {
    action: action_loading,
    result: (state, payload) => ({
      ...state,

      loading: true
    })
  }, {
    action: action_loaded,
    result: (state, payload) => ({
      ...state,

      loading: false
    })
  }, {
    action: action_store_query,
    result: (state, payload) => ({
      ...state,

      query: payload
    })
  }])

  return {
    reducer: (state = initState, { type, payload }) => {
      for (let i = 0, len = action.length; i < len; i++) {
        if (type === action[i].action) {
          return action[i].result(state, payload)
        }
      }

      return state
    },
    success: (payload) => ({ payload, type: action_success }),
    error: (payload) => ({ payload, type: action_error }),
    reset: (payload) => ({ payload, type: action_reset }),
    loading: (payload) => ({ payload, type: action_loading }),
    loaded: (payload) => ({ payload, type: action_loaded }),
    storeQuery: (payload) => ({ payload, type: action_store_query }),
  }
}
