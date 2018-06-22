import { combineReducers } from 'redux'

import { reducer as user_reducer } from './user'
import { reducer as building_reducer } from './building'
import { reducer as search_hot_reducer } from './search_hot'

export default combineReducers({
  user: user_reducer,
  building: building_reducer,
  search_hot: search_hot_reducer,
})
