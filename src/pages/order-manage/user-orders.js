import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Navigation } from '../../components/navigation'
import { Search } from '../../components/search/search'
import { Etable } from '../../components/e-table'
import { Switch } from '../../components/switch'
import store from '../../assets/img/store.png'
import img from '../../assets/img/empty.png'
import Empty from '../../components/empty/index'
import './userOrder.scss'
import { openMsgWindow } from '../../services/winref'
import {
  Tag
} from 'antd'

const cols = () => [
  {
    title: '商品信息',
    key: 'info',
    width: '320px',
    render (row) {
      return (
        <div style={{height: '80px', width: '320px', display: 'flex'}}>
          <div style={{width: '80px', height: '80px', position: 'relative'}}>
            {row.GoodsPhoto ? <img alt="商品设计封面" src={row.GoodsPhoto} style={{width: '100%', height: '100%'}}/>
              : <div style={{height: '100%', border: '1px solid #EAEAEA', textAlign: 'center', lineHeight: '80px'}}>暂无图片</div>
            }
            {row.GoodsKind == 1 ? <span className="presellTip">众测</span> : null}
          </div>
          <div style={{flex: '1', paddingLeft: '15px'}}>
            <div className="ellipsis" style={{marginBottom: '6px'}}>{row.GoodsName}</div>
            <p style={{marginBottom: '6px', color: '#999999'}}>参数：{row.GoodsParamsExplain}</p>
            <p style={{marginBottom: '6px', color: '#999999'}}>数量：{row.GoodsNumber + row.GoodsSeriesUnit}</p>
            <p style={{marginBottom: '6px', color: '#999999'}}>交货期：{row.DeliveryDate}</p>
          </div>
        </div>
      )
    }
  },
  {
    title: '订单金额',
    // dataIndex: 'TotalProductAmount',
    key: 'TotalProductAmount',
    align: 'center',
    render (row) {
      return (
        <span>
          {row.TotalProductAmount + '元'}
        </span>
      )
    }
  },
  {
    title: '已付金额',
    // dataIndex: 'HasPayFee',
    key: 'HasPayFee',
    align: 'center',
    render (row) {
      return (
        <span>
          {row.HasPayFee + '元'}
        </span>
      )
    }
  },
  {
    title: '订单状态',
    // dataIndex: 'OrderState',
    key: 'OrderState',
    align: 'center',
    render (row) {
      return (
        <span>
          {row.OrderState == 0 ? <span>待付款</span>
            : (row.OrderState == 1 ? <span>待发货</span>
              : (row.OrderState == 2 ? <span>待收货</span>
                : (row.OrderState == 3 ? <span>已完成</span> : '')
              ))
          }
        </span>
      )
    }
  },
]

@inject('userOrders')
@observer
class UserOrders extends Component {
  toChat = (url, name, headImageUrl) => {
    // console.log(url, name)
    openMsgWindow(url, name, headImageUrl)
  }
  row = (it) => (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <span>
        <span style={{display: 'inline-block', width: '448px', verticalAlign: 'middle'}}>
          <span>订单号：{it.OrderNo}</span> &nbsp;&nbsp;
          <span>
            {it.IsIncludeTax == 1 ? <Tag color="orange">含税</Tag> : null}
            {/* {it.GoodsKind == 1 ? <Tag color="red">众测</Tag> : null} */}
          </span>&nbsp;&nbsp;
          <span>{it.StoreName}</span> &nbsp;&nbsp;
          {/* <span>云仓库存：{it.YunNum}</span>  */}
        </span>
        <a href="javascript:void(0);" style={{color: '#33CCCC'}} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}><img src={store} style={{marginRight: 5}}/>联系设计师</a>
      </span>
      <span>下单时间：{it.InDate} &nbsp;&nbsp;
        {it.IsOp == 0 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户未付款</span>
          : (it.IsOp == 1 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户已付款</span>
            : (it.IsOp == 2 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户待收货</span>
              : (it.IsOp == 3 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户已收货</span> : '')
            )
          )
        }
      </span>
    </div>
  )

  componentDidMount () {
    const { getUseOrder } = this.props.userOrders
    getUseOrder()
  }
  componentWillUnmount () {
    const url = window.location.href
    const { dispose } = this.props.userOrders
    if (url.indexOf('/order/userOrder') === -1) {
      dispose()
    }
  }

  render () {
    const { dataDisplay, OrderNum0, OrderNum1, OrderNum2, OrderNum3 } = this.props.userOrders
    const s = this.props.userOrders
    return (
      <div className="user-order" style={{padding: '0 10'}}>
        <div className="chooseDesign" style={{display: 'flex', justifyContent: 'space-between'}}>
          <Navigation tags={['订单管理', '用户订单']}/>
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search}/>
        </div>
        <div className="chooseDesign" style={{padding: '12px', minHeight: 'calc(100% - 160px)'}}>
          <Switch tabs={[
            {label: '全部', click: s.changeStat('全部')},
            {label: '待付款', click: s.changeStat('待付款'), num: OrderNum0},
            {label: '待发货', click: s.changeStat('待发货'), num: OrderNum1},
            {label: '待收货', click: s.changeStat('待收货'), num: OrderNum2},
            {label: '已完成', click: s.changeStat('已完成'), num: OrderNum3}
          ]}
          cur={s.curStatLabel}
          />
          {dataDisplay.length ? <Etable columns={cols(this)} data={dataDisplay} rowItem={this.row} pagination={{...s.paging}}/>
            : <Empty img={img} text='当前页面无数据' style={{ color: '#000' }} />}
        </div>
      </div>
    )
  }
}

export default UserOrders
