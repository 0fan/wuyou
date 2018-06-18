import { createContext } from 'react'

export default createContext({
  contentConfig: [],
  changeContent: f => f,

  footerConfig: [],
  changeFooter: f => f,
})