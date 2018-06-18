import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Image from 'component/image'
import BottomText from 'component/bottom-text'

import style from './index.less'

@connect(state => ({
  user: state.user
}), {})
export default class App extends Component {
  state = {
    data: Array(2).fill(0).map((v, i) => ({
      id: i,
      img: 'http://img5.imgtn.bdimg.com/it/u=1249777653,196599392&fm=27&gp=0.jpg',
      title: '融创九樾府',
      tag: ['观山湖区', '高层'],
      news: {
        text: '融创九樾府5月25日2栋大平层开盘',
        link: '/i'
      },
      referencePrice: 14000,
      owner: 342,
      hot: 70,
      to: `/building/${ i }`
    }))
  }

  handleClick = (v, i, e) => {
    this.props.history.push(`/building/${ v.id }`)
  }

  render () {
    return (
      <List
        data = { this.state.data }

        renderHeader = { () => <div>共绑定{ this.state.data.length }个楼盘</div> }
        renderFooter = { () => <BottomText>没有更多</BottomText> }

        onClick = { this.handleClick }
      />
    )
  }
}

const List = props => {
  const {
    data = [],

    renderHeader,
    renderFooter,

    children,

    onClick,

    ...rest
  } = props

  return (
    <div className = { style['list-wrap'] }>
      {
        renderHeader ?
          <div className = { style['list-header'] }>{ renderHeader() }</div> :
          null
      }
      <div className = { style['list-body'] }>
        {
          data.map((v, i) => (
            <List.Item
              { ...v }

              onClick = { e => { onClick(v, i, e) } }

              key = { i }
            />
          ))
        }
      </div>
      {
        renderFooter ?
          <div className = { style['list-footer'] }>{ renderFooter() }</div> :
          null
      }
    </div>
  )
}

List.Item = props => {
  const {
    title,
    tag = [],
    news,
    referencePrice,
    owner,
    hot,
    img,
    onClick,

    childre,

    ...rest
  } = props

  return (
    <div className = { style['item'] } onClick = { onClick }>
      <div className = { style['item-inner'] }>
        <div className = { style['item-body'] }>
          <div className = { style['item-title'] }>{ title }</div>
          {
            tag.length ?
              <div className = { style['item-tag'] }>
                {
                  tag.map((v, i) => (
                    <div className = { style['item-tag-item'] } key = { i }>{ v }</div>
                  ))
                }
              </div> :
              null
          }
          {
            news ?
              <Link onClick = { e => e.stopPropagation() } to = { news.link } className = { style['item-news'] }>
                <div className = { style['item-news-text'] }>{ news.text }</div>
              </Link> :
              null
          }
        </div>
        <div className = { style['item-footer'] }>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>参考价格</div>
            <div className = { style['item-footer-item-value'] }>{ referencePrice }</div>
          </div>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>业主人数</div>
            <div className = { style['item-footer-item-value'] }>{ owner }</div>
          </div>
          <div className = { style['item-footer-item'] }>
            <div className = { style['item-footer-item-title'] }>楼盘热度</div>
            <div className = { style['item-footer-item-value'] }>{ hot }°</div>
          </div>
        </div>
      </div>
      <div className = { style['item-bg'] }>
        <Image src = { img } />
      </div>
    </div>
  )
}