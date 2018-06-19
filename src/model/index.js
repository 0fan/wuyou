import { combineReducers } from 'redux'

import { reducer as user_reducer } from './user'
import { reducer as building_reducer } from './building'

export default combineReducers({
  user: user_reducer,
  building: building_reducer,
})
