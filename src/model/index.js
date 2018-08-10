import { combineReducers } from 'redux'

import { reducer as user_reducer } from './user'
import { reducer as building_reducer } from './building'
import { reducer as search_hot_reducer } from './search_hot'
import { reducer as new_building_reducer } from './new_building'
import { reducer as building_filter_reducer } from './building_filter'

export default combineReducers({
  user: user_reducer,
  building: building_reducer,
  search_hot: search_hot_reducer,
  new_building: new_building_reducer,
  building_filter: building_filter_reducer,
})
