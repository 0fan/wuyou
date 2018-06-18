import React, { PureComponent } from 'react'
import LazyLoad from 'react-lazyload'

import { Spin } from 'antd'
import style from './index.less'

export default props => {
  const {
    src,

    ...rest
  } = props

  return (
    <LazyLoad
      once
      overflow = { true }
      placeholder = { <Spin className = { style.loading } /> }
      offset = { [0, 0] }

      { ...rest }
    >
      <img src = { src } />
    </LazyLoad>
  )
}
