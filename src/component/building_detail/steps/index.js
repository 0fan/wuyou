import React, { Component, Fragment } from 'react'

import Step from './step'

import style from './index.less'

const { Spacer } = Step

class App extends Component {
  render () {
    const {
      children,
      data = [],
      index,
      active,

      ...rest
    } = this.props

    return (
      <div className = { style['steps'] }>
        {
          data.map((v, i) => (
            <Fragment key = { i }>
              <Step
                index = { index }
                active = { active }
                current = { index === i }
                { ...v }
              />
              {
                i < data.length - 1 ?
                  <Spacer /> :
                  null
              }
            </Fragment>
          ))
        }
        { children }
      </div>
    )
  }
}

App.Step = Step

export default App
