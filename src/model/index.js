import { combineReducers } from 'redux'

import { reducer as user_reducer } from './user'

export default combineReducers({
  user: user_reducer,
})
