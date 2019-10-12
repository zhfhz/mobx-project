/* eslint-disable no-console */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation/index';
import './style.scss';
import { Search } from '../../components/search/search';
import { Etable } from '../../components/e-table';
import Empty from '../../components/empty/index';
import { RouteComponentProps } from 'react-router-dom';
import store from '../../assets/img/store.png';
import { openMsgWindow } from '../../services/winref';
import img from '../../assets/img/empty.png';
interface Props extends RouteComponentProps {
  match: { params: any };
}

const OrderStataMap = {
  '0': '待付款',
  '1': '待发货',
  '2': '待收货',
  '3': '已完成'
};

const cols = () => [
  {
    title: '商品信息',
    key: 'info',
    width: '360px',
    render (row) {
      return (
        <div style={{ width: '320px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', diplay: 'inline-flex', justifyContent: 'center' }}>
            <img alt="商品封面" src={row.GoodsPhoto} style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ flex: '1.5 1', paddingLeft: '15px', display: 'flex', flexDirection: 'column' }}>
            <div>{row.GoodsName}</div>
            <div style={{ color: '#999' }}>数量：{row.GoodsNumber}</div>
            <div style={{ color: '#999' }}>交货期：{row.DeliveryDate}</div>
          </div>
        </div>
      );
    }
  },
  {
    title: '数量',
    dataIndex: 'GoodsNumber',
    align: 'center'
  },
  {
    title: '订单金额',
    dataIndex: 'TotalProductAmount',
    align: 'center'
  },
  {
    title: '已付金额',
    dataIndex: 'HasPayFee',
    align: 'center'
  },
  {
    title: '订单状态',
    align: 'center',
    render (row) {
      return OrderStataMap[row.OrderState];
    }
  }
];

@inject('preOrder')
@observer
class Order extends Component {
  componentDidMount () {
    const code = this.props.match.params.id;
    const s = this.props.preOrder;
    console.log(code);
    s.GoodsSeriesCode = code;
    s.PresellState = '';
    s.getData();
  }
  componentWillUnmount () {
    const { dispose } = this.props.preOrder;
    dispose();
  }
  tipMessgae = it => {
    let tip = '';
    switch (it.IsOp) {
    case '0':
      tip = '用户未付款';
      break;
    case '1':
      tip = '用户已付款';
      break;
    case '2':
      tip = '用户待收货';
      break;
    case '3':
      tip = '用户已收货';
      break;
    }
    return tip;
  };
  toChat = (url, name, headImageUrl) => {
    console.log(url, name);
    openMsgWindow(url, name, headImageUrl);
  };
  row = it => {
    const style = {
      display: 'inline-block',
      width: '30px',
      height: '14px',
      lineHeight: '14px',
      border: '1px solid #ff9900',
      color: '#ff9900',
      marginRight: '15px',
      verticalAlign: 'middle'
    };
    const tipMsg = this.tipMessgae(it);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <span style={{ display: 'inline-block', width: '200px', verticalAlign: 'middle' }}>订单号：{it.OrderNo}</span>
          {it.IsIncludeTax === '1' ? <span style={style}>含税</span> : <span style={{ display: 'inline-block', width: 30, marginRight: 15 }} />}
          <span style={{ display: 'inline-block', width: '200px', verticalAlign: 'middle' }}>{it.StoreName}</span>
          <a href="javscript:void(0)" style={{ color: '#33CCCC' }} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}>
            <img src={store} style={{ marginRight: 5 }} />
            联系设计师
          </a>
        </span>
        <p style={{ margin: 0 }}>
          <span>下单时间：{it.InDate}</span>
          <span style={{ color: '#FB6666', display: 'inline-block', width: '120px', textAlign: 'right' }}>{tipMsg}</span>
        </p>
      </div>
    );
  };

  render () {
    const s = this.props.preOrder;
    return (
      <div className="goods_manage_page">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '20px', backgroundColor: '#fff' }}>
          <Navigation tags={['商品管理', '常规商品']} />
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search} />
        </div>
        <div style={{ padding: '12px', backgroundColor: '#fff', minHeight: 'calc(100% - 160px)' }}>
          {s.tableDataDisplay.length ? (
            <Etable columns={cols(this)} data={s.tableDataDisplay} rowItem={this.row} pagination={{ ...s.paging }} />
          ) : (
            <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
          )}
        </div>
      </div>
    );
  }
}

export default Order;
