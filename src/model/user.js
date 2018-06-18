import reduxGenerator from 'util/reduxGenerator'

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
    id: '',
    name: '',
    role: '',
  },

  auth: true

})