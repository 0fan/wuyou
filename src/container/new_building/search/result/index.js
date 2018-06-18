import React, { Component, Fragment } from 'react'

import Search from 'component/search'
import HouseList from 'component/house-list'

export default class App extends Component {
  constructor (props) {
    super(props)

    const value = props.match.params.word

    this.state = {
      value: value ? window.decodeURI(value) : ''
    }
  }

  render () {
    return (
      <Fragment>
        <Search
          value = { this.state.value }
          onChange = { v => this.setState({ value: v }) }
          placeholder = '输入楼盘名称'
        />
        <HouseList>
          {
            Array(20).fill(0).map((v, i) => (
              <HouseList.Item
                src = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=711083651,637577709&fm=27&gp=0.jpg'
                title = '融创九樾府'
                area = '观山湖区'
                tag = { ['高层', '品牌地产'] }
                price = '均价20300元/平'

                key = { i }
              />
            ))
          }
        </HouseList>
      </Fragment>
    )
  }
}