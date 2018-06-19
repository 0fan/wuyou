import store from 'store'
import axios from 'axios'

import {
  success
} from 'model/user'

export default function getUserData (_store) {
  const data = store.get('user')

  if (data) {
    const { token } = data

    _store.dispatch(success(data))
    axios.defaults.headers.common['token'] = token
  }
}