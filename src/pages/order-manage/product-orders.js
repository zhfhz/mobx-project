import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Navigation } from '../../components/navigation'
import { Search } from '../../components/search/search'
import { Etable } from '../../components/e-table'
import { Switch } from '../../components/switch'
import store from '../../assets/img/store.png'
import img from '../../assets/img/empty.png'
import './productOrder.scss'
import {
  Tag, Modal, Button, Input, DatePicker
} from 'antd'
import moment from 'moment'
import Empty from '../../components/empty/index'
import { openMsgWindow } from '../../services/winref'

const { TextArea } = Input
const dateFormat = 'YYYY-MM-DD'

const cols = (page) => (
  [{
    title: '商品信息',
    key: 'info',
    render (row) {
      return (
        <div style={{height: '80px', width: '320px', display: 'flex'}}>
          <div style={{width: '80px', height: '80px', position: 'relative'}}>
            {/* {row.GoodsKind == 1 ?(row.GoodsSurfaceImg?<img alt="设计封面" src={row.GoodsSurfaceImg} style={{width: '100%', height: '100%'}}/>:
              <div style={{height:'100%',border:'1px solid #EAEAEA',textAlign:'center',lineHeight:'80px'}}>暂无图片</div>
            ):(row.ParamOptionalIcon?<img alt="设计封面" src={row.ParamOptionalIcon} style={{width: '100%', height: '100%'}}/>:
              <div style={{height:'100%',border:'1px solid #EAEAEA',textAlign:'center',lineHeight:'80px'}}>暂无图片</div>
            )} */}
            {row.GoodsPhoto ? <img alt="商品设计封面" src={row.GoodsPhoto} style={{width: '100%', height: '100%'}}/>
              : <div style={{height: '100%', border: '1px solid #EAEAEA', textAlign: 'center', lineHeight: '80px'}}>暂无图片</div>
            }
            {row.GoodsKind == 1 ? <span className="presellTip">众测</span> : null}
          </div>
          <div style={{flex: '1', paddingLeft: '15px'}}>
            <div className="ellipsis" style={{marginBottom: '6px'}}>{row.GoodsName}</div>
            <p style={{marginBottom: '6px', color: '#999999'}}>数量：{row.GoodsNumber + row.GoodsSeriesUnit}</p>
            <p style={{marginBottom: '6px', color: '#999999'}}>交货期：{row.DeliveryDate}</p>
          </div>
        </div>
      )
    }
  }, {
    title: '订单总价',
    // dataIndex: 'TotalOrderAmount',
    key: 'TotalOrderAmount',
    align: 'center',
    render (row) {
      return (
        <span>
          {row.TotalOrderAmount + '元'}
        </span>
      )
    }
  }, {
    title: '订单状态',
    // dataIndex: 'OrderState',
    key: 'OrderState',
    align: 'center',
    render (row) {
      return (
        <span>
          {row.OrderState == 0 ? <span>待付款</span>
            : (row.OrderState == 1 ? <span>待发货</span>
              : (row.OrderState == 2 ? <span>已发货</span>
                : (row.OrderState == 3 ? <span>已完成</span> : '')
              ))
          }
        </span>
      )
    }
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render (record) {
      return (
        <span>
          <span style={{cursor: 'pointer', color: '#33CCCC'}} onClick={page.showModal.bind(this, record.OrderNo)}>查看详情</span>&nbsp;&nbsp;&nbsp;&nbsp;
          {
            record.OrderState == 1
              ? <span style={{cursor: 'pointer', color: '#33CCCC'}} onClick={page.showDeliverModal.bind(this, record.GoodsSeriesCode, record.OrderNo)}>发货</span>
              : (record.OrderState == 2 || record.OrderState == 3
                ? <span style={{cursor: 'pointer', color: '#33CCCC'}} onClick={page.showShippedModal.bind(this, record.OrderNo)}>发货详情</span> : ''
              )
          }
        </span>
      )
    }
  },
  ]
)

@inject('productOrder')
@observer
class ProductOrders extends Component {
  componentDidMount () {
    const { getProductOrder } = this.props.productOrder
    getProductOrder()
  }
  componentWillUnmount () {
    const url = window.location.href
    const { dispose } = this.props.productOrder
    if (url.indexOf('/order/productOrder') === -1) {
      dispose()
    }
  }

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
            {/* {it.GoodsKind == 1 ? <Tag color="red">众测</Tag> : null}     */}
          </span>&nbsp;&nbsp;
          <span>{it.StoreName}</span> &nbsp;&nbsp;
        </span>
        <a href="javascript:void(0);" style={{color: '#33CCCC'}} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}><img src={store} style={{marginRight: 5}}/>联系设计师</a>
      </span>
      <span>下单时间：{it.InDate}
        {it.IsOp == 0 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户未付款</span>
          : (it.IsOp == 1 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户已付款</span>
            : (it.IsOp == 2 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户未收货</span>
              : (it.IsOp == 3 ? <span style={{color: '#FB6666', display: 'inline-block', width: '150px', textAlign: 'right'}}>用户已确认收货</span> : '')
            )
          )
        }
      </span>
    </div>
  )
  showModal = (OrderNo) => {
    this.props.productOrder.visible = true
    const { getDetailProductOrder } = this.props.productOrder
    getDetailProductOrder(OrderNo)
  }
  showDeliverModal = (GoodsSeriesCode, OrderNo) => {
    // 发货的弹框
    this.props.productOrder.visible1 = true
    const { getDetailProductOrder } = this.props.productOrder
    this.props.productOrder.data.OrderNo = OrderNo
    this.props.productOrder.YGoodsSeriesCode = GoodsSeriesCode
    getDetailProductOrder(OrderNo)
  }
  showShippedModal = (OrderNo) => {
    // 发货详情弹框
    this.props.productOrder.visible3 = true
    const { getOrdershipping } = this.props.productOrder
    getOrdershipping(OrderNo)
  }
  onchange = (key) => (e) => {
    this.props.productOrder.onchange(key, e.target.value)
  }
  onChangeData = (key) => (date, dateString) => {
    this.props.productOrder.onChangeData(key, dateString)
  }

  render () {
    const {
      visible,
      visible1,
      visible3,
      visible4,
      dataDisplay,
      OrderNum1,
      OrderNum2,
      OrderNum3,
      GoodsParamsExplain,
      // ParamOptionalIcon,
      GoodsPhoto,
      DeliveryDate,
      UserName,
      MobileNumber,
      Addressdetail,
      GoodsNumber,
      GoodsSeriesUnit,
      data,
      UserNameShip,
      MobileNumberShip,
      AddressShip,
      TotalProductNumberShip,
      BillNoShip,
      ExpNameShip,
      DeliveryDateShip,
      YunNum
    } = this.props.productOrder
    const s = this.props.productOrder
    return (
      <div className="product-order-page">
        <div className="chooseDesign" style={{display: 'flex', justifyContent: 'space-between'}}>
          <Navigation tags={['订单管理', '生产订单']}/>
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search}/>
        </div>
        <div className="chooseDesign" style={{padding: '12px', minHeight: 'calc(100% - 160px)'}}>
          <Switch tabs={[
            {label: '全部', click: s.changeStat('全部')},
            {label: '待发货', click: s.changeStat('待发货'), num: OrderNum1},
            {label: '已发货', click: s.changeStat('已发货'), num: OrderNum2},
            {label: '已完成', click: s.changeStat('已完成'), num: OrderNum3}
          ]}
          cur={s.curStatLabel}
          />
          {dataDisplay.length ? <Etable columns={cols(this)} data={dataDisplay} rowItem={this.row} pagination={{...s.paging}}/>
            : <Empty img={img} text='当前页面无数据' style={{ color: '#000' }} />}
        </div>
        <Modal className="product-order-modal" title="详情" visible={visible} onCancel={s.close} footer={[
          <Button key="back" onClick={s.close} style={{background: '#33CCCC', color: '#fff'}}>取消</Button>]}
        >
          <div className="label">
            <label>参数组合：</label>
            <div style={{display: 'inline-block', height: '45px', lineHeight: '45px', fontSize: '14px', verticalAlign: 'top'}}>{GoodsParamsExplain}</div>
          </div>
          <div className="label">
            <label>参数图片：</label>
            <div style={{display: 'inline-block', fontSize: '14px', verticalAlign: 'top'}}>
              {GoodsPhoto ? <img alt="商品设计封面" src={GoodsPhoto} style={{width: '80px', height: '80px'}}/>
                : <div style={{width: '80px', height: '80px', border: '1px solid #EAEAEA', textAlign: 'center', lineHeight: '80px'}}>暂无图片</div>
              }
            </div>
          </div>
          <div className="label">
            <label>交货期：</label>
            <div style={{display: 'inline-block', height: '45px', lineHeight: '45px', fontSize: '14px', verticalAlign: 'top'}}>{DeliveryDate}</div>
          </div>
        </Modal>
        {/* <Modal className="product-order-modal" title="提示" visible={visible2} onCancel={s.close} onOk={s.handleOk} cancelText="取消" okText="确定">
          <p> 确认生产完成吗？</p>
        </Modal> */}
        {/* <Modal className="product-order-modal" title="提示" visible={visible1} onCancel={s.close} onOk={s.handleOk1} cancelText="取消" okText="确定">
          <p> 确认发货吗？确认后，快递公司将上门取件</p>
        </Modal> */}
        <Modal className="product-order-modal" title="发货" visible={visible1} onCancel={s.close} footer={null}>
          <div className="label"><label>收件人：</label>{UserName}</div>
          <div className="label"><label>联系电话：</label>{MobileNumber}</div>
          <div className="label"><label>收货地址：</label>{Addressdetail}</div>
          <div className="label"><label>商品数量：</label>{GoodsNumber}</div>
          <div className="label">
            <label>运单号：</label>
            <Input onChange={this.onchange('BillNo')} value={data.BillNo} placeholder="请输入运单号" />
          </div>
          <div className="label">
            <label>快递公司：</label>
            <Input onChange={this.onchange('ExpName')} value={data.ExpName} maxLength={6} placeholder="请输入快递公司" />
          </div>
          <div className="label">
            <label>发货时间：</label>
            <DatePicker placeholder="请选择发货时间" onChange={this.onChangeData('DeliveryDate')} value={data.DeliveryDate ? moment(data.DeliveryDate, dateFormat) : undefined} />
          </div>
          <div className="label">
            <label>说明：</label>
            <TextArea onChange={this.onchange('Remark')} value={data.Remark}  rows={4} style={{width: '270px', verticalAlign: 'top'}} placeholder="请输入附件说明"/>
          </div>
          <div className="label">
            <label></label>
            <Button type="primary" onClick={s.submitData}>确定</Button>
          </div>
        </Modal>
        <Modal className="product-order-modal" title="发货详情" visible={visible3} onCancel={s.close} footer={[
          <Button key="back" onClick={s.close} style={{background: '#33CCCC', color: '#fff'}}>取消</Button>]}
        >
          <div className="label"><label>收件人：</label>{UserNameShip}</div>
          <div className="label"><label>联系电话：</label>{MobileNumberShip}</div>
          <div className="label"><label>收货地址：</label>{AddressShip}</div>
          <div className="label"><label>商品数量：</label>{TotalProductNumberShip}</div>
          <div className="label"><label>运单号：</label>{BillNoShip}</div>
          <div className="label"><label>快递公司：</label>{ExpNameShip}</div>
          <div className="label"><label>发货时间：</label>{DeliveryDateShip}</div>
        </Modal>
        <Modal className="product-order-modal" title="提示" visible={visible4} onCancel={s.close} onOk={s.handleOk4} cancelText="取消" okText="确定">
          <p style={{textAlign: 'center'}}>此商品库存不足或未添加，请生产满足库存后发货！</p>
          <div className="label" style={{position: 'relative'}}>
            <label>实时库存：</label>
            <Input placeholder="请输入库存" onChange={s.onchangeY} value={YunNum} />
            <span style={{position: 'absolute', right: '70px'}}>{GoodsSeriesUnit}</span>
          </div>
          <p style={{color: '#FF8686', fontSize: '12px', textAlign: 'center'}}>说明：库存可随时修改，请确认好再填写，便于设计师销售产品</p>
        </Modal>
      </div>
    )
  }
}

export default ProductOrders
