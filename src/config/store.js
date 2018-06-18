import store from 'store'

import {
  success
} from 'model/user'

export default function getUserData (_store) {
  const data = store.get('user')

  if (data) {
    _store.dispatch(success(data))
  }
}