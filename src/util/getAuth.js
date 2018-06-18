import store from 'store'

export default () => {
  return store.get('user') ? true : false
}
