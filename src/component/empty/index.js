import React from 'react'
import cs from 'classnames'

import style from './index.less'

export default props => {
  const {
    type = 'empty',
    text,
    children,

    ...rest
  } = props

  return (
    <div
      className = {
        cs(style.empty, style[`empty-${ type }`])
      }

      { ...rest }
    >
      <div className = { style['empty-inner'] }>
        <div className = { style['empty-legend'] } />
        <div className = { style['empty-content'] }>
          {
            text ?
              <div className = { style['empty-text'] }>{ text }</div> :
              null
          }
          { children }
        </div>
      </div>
    </div>
  )
}