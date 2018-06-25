import React, { Component, Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import { Toast } from 'antd-mobile'
import { Row, Col } from 'antd'
import Button from 'component/button'
import Alert from 'component/alert'

import { buildingAuthorization } from 'model/building'

import { url, api } from 'config/api'

import style from './index.less'

const { server } = url
const { auth } = api.building

@withRouter
@connect(state => ({
  building: state.building
}), {
  buildingAuthorization
})
export default class App extends Component {
  isMount = true

  state = {
    msg: '',
    loading: false
  }

  componentWillUnmount () {
    this.isMount = false
  }

  handleAgree = async () => {
    const { id } = this.props.match.params

    this.setState({ loading: true, msg: '' })

    const [err, res] = await axios.post(server + auth, {
      buildingId: id
    })

    if (!this.isMount) {
      return
    }

    this.setState({ loading: false })

    if (err) {
      this.setState({ msg: err })

      return [err]
    }

    Toast.success('授权成功', 3, null, false)

    this.props.buildingAuthorization()
    this.props.history.push(`/building/${ id }/track/progress`)
  }

  handleDisagree = () => {
    this.props.history.push('/')
  }

  render () {
    return (
      <Fragment>
        <Alert message = { this.state.msg } />
        <div className = { style.protocol }>
          <h2>用户信息授权协议</h2>
          <p>用户信息授权协议（以下简称“本协议”）是重庆壹平方米网络科技有限公司（以下称“壹平方米”）与用户（以下简称“您”）就个人信息授权使用所订立的合约。本协议自您使用壹平方米的相关服务，并阅读之后起，有效至您按本协议约定的方式通知壹平方米终止服务关系为止。在接受本协议之前，请您仔细阅读本协议的全部内容。如果您不同意本协议的任意内容，或者无法准确理解该条款的含义，请不要进行任何操作。</p>
          <p>您同意并授权壹平方米将您的个人信息提供给贵州房云网大数据技术有限公司 （以下简称“房云网”），以用于您向房云网申请开立个人网签服务账户。个人网签服务账户能否开立以及您可使用的网签账户服务内容等，以您和房云网约定为准。</p>
          <h3>一、服务内容</h3>
          <p>壹平方米是以提供智慧化场景服务为导向，并深入研究客户实际需求，以智慧、创新的房产营销管理系统为房产商提供安全、高效的营销前端智慧服务、销售数据、客户数据管理服务。</p>
          <p>1、存款证明服务：为用户开通银行电子Ⅱ类账户，Ⅱ类户可以绑定一个I类户，Ⅱ类户可与绑定账户实现资金互转，可转入转出，存取自由，为用户向开发商提供资金证明服务。</p>
          <p>2、付款服务：与合作支付机构（银商、拉卡拉等）合作，为用户向开发商提供支付房款、契税、印花税、物业费、大修基金等服务。</p>
          <p>3、在线选房服务：为客户提供开盘前的APP预选房，开盘后的APP或现场一体机选房、锁房、付款等功能。</p>
          <p>4、里面APP：为用户提供在线选房，置业交流，楼盘进度追踪等楼盘相关服务。</p>
          <p>5、金融服务：为客户提供装修、买房、保险、理财等相关服务</p>
          <h3>二、用户信息获取范围</h3>
          <p>我们可能获取的用户信息类型包括：</p>
          <p>1、账户信息（如，壹平方米账号、交易明细及使用记录及在使用过程中提供的其他信息）；</p>
          <p>2、个人或公司联系方式（如，姓名、公司名称、通讯地址、电邮地址、电话、手机号码、传真号码）；</p>
          <p>3、用于您身份识别的信息（如，身份证号码）；</p>
          <p>4、财务信息（如，银行卡号/账号、户名、开户行等相关信息）；</p>
          <Row gutter = { 10 } className = { style.footer }>
            <Col span = { 12 }>
              <Button onClick = { this.handleDisagree } size = 'large'>不同意</Button>
            </Col>
            <Col span = { 12 }>
              <Button loading = { this.state.loading } onClick = { this.handleAgree  } size = 'large' type = 'primary'>已阅读并同意授权</Button>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}
