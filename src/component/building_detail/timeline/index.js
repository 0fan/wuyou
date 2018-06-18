import React, { Component } from 'react'
import moment from 'moment'
import cs from 'classnames'

import style from './index.less'

class App extends Component {
  render () {
    const {
      data,
      date = false,

      children,

      ...rest
    } = this.props

    const stringString = cs(
      style.timeline, {
        [style['timeline-date']]: date
      }
    )

    return (
      <div className = { stringString } { ...rest }>
        {
          children ?
            children :
            data.map((v, i) => (
              <App.Item { ...v } key = { i } />
            ))
        }
      </div>
    )
  }
}

App.Item = props => {
  const {
    type,
    date,

    children,

    ...rest
  } = props

  const classString = cs(
    style.item, {
      [style[`item-${ type }`]]: type,
      [style['item-date']]: date,
    }
  )

  return (
    <div className = { classString } { ...rest }>
      <div className = { style['item-line'] }>
        {
          date ?
            <DateBox date = { date } /> :
            null
        }
      </div>
      <div className = { style['item-content'] }>
        { children }
      </div>
    </div>
  )
}

const DateBox = props => {
  const {
    date,

    ...rest
  } = props

  return (
    <div className = { style['date-box'] }>
      <div className = { style['date-box-md'] }>{ moment(date).format('MM-DD') }</div>
      <div className = { style['date-box-y'] }>{ moment(date).format('YYYY') }</div>
    </div>
  )
}

export default App
