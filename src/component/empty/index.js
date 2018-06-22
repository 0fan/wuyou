import React from 'react'
import cs from 'classnames'

import style from './index.less'

export default props => {
  const {
    type = 'empty',
    text,
    ratio = 1,
    children,
    style: _style = {},

    ...rest
  } = props

  let styleString = _style

  if (ratio) {
    styleString.paddingBottom = `${ ratio * 100 }%`
  }

  return (
    <div
      className = {
        cs(style.empty, style[`empty-${ type }`])
      }

      style = { styleString }

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