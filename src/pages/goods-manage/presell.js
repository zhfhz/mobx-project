/* eslint-disable no-console */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation/index';
import './style.scss';
import { Search } from '../../components/search/search';
import { Switch } from '../../components/switch';
import { Etable } from '../../components/e-table';
import store from '../../assets/img/store.png';
import img from '../../assets/img/empty.png';
import Empty from '../../components/empty/index';
import { openMsgWindow } from '../../services/winref';

const cols = page => [
  {
    title: '商品信息',
    key: 'info',
    width: '320px',
    render (row) {
      return (
        <div style={{ width: '320px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', display: 'inline-flex', justifyContent: 'center' }}>
            <img alt="设计封面" src={row.GoodsPhoto} style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ flex: '1.5 1', paddingLeft: '15px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '6px' }}>{row.GoodsSeriesTitle}</div>
            <p style={{ marginBottom: '6px', color: '#999999' }}>截止日期：{row.EndTime}</p>
            <p style={{ marginBottom: '6px', color: '#999999' }}>众测数量：{row.PresellNum + row.GoodsSeriesUnit}</p>
          </div>
        </div>
      );
    }
  },
  {
    title: '品类',
    align: 'center',
    render (row) {
      return row.CategoryName2 + '-' + row.CategoryName3;
    }
  },
  {
    title: '商品ID',
    dataIndex: 'GoodsSeriesCode',
    align: 'center'
  },
  {
    title: '价格',
    align: 'center',
    render (row) {
      return row.NowMarketNoTax + '元起';
    }
  },
  {
    title: '起订量',
    align: 'center',
    render (row) {
      return row.SetNum + row.GoodsSeriesUnit + '起';
    }
  },
  {
    title: '上架状态',
    align: 'center',
    render (row) {
      return row.GoodsState === '1' ? '上架' : '下架';
    }
  },
  {
    title: '',
    key: 'operates',
    render (row) {
      return (
        <span>
          <a href="javascript:void(0)" onClick={page.toDetail.bind(this, row.GoodsSeriesCode)} style={{ color: '#33CCCC' }}>
            查看详情
          </a>
          &nbsp;&nbsp;
          <a href="javascript:void(0)" onClick={page.toOrders.bind(this, row.GoodsSeriesCode)} style={{ color: '#33CCCC' }}>
            众测订单
          </a>
          &nbsp;&nbsp;
        </span>
      );
    }
  }
];

@inject('presell')
@observer
class Presell extends Component {
  componentDidMount () {
    const s = this.props.presell;
    s.getData();
  }
  componentWillUnmount () {
    const url = window.location.href;
    const { dispose } = this.props.presell;
    if (url.indexOf('/goods/presell') === -1) {
      dispose();
    }
  }
  toChat = (url, name, headImageUrl) => {
    console.log(url, name);
    openMsgWindow(url, name, headImageUrl);
  };
  row = it => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <span style={{ display: 'inline-block', width: '200px', verticalAlign: 'middle' }}>设计编号：{it.GoodsSeriesCode}</span>
          <span style={{ display: 'inline-block', width: '200px', verticalAlign: 'middle' }}>{it.StoreName}</span>
          <a href="javscript:void(0)" style={{ color: '#33CCCC' }} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}>
            <img src={store} style={{ marginRight: 5 }} />
            联系设计师
          </a>
        </span>
        <span>编辑时间：{it.EditWhen}</span>
      </div>
    );
  };

  toOrders = GoodsSeriesCode => {
    const s = this.props.presell;
    this.props.history.push('/goods/presell/preOrder/' + GoodsSeriesCode + '/' + s.PresellState);
  };

  toDetail = GoodsSeriesCode => {
    this.props.history.push('/goods/presell/predetail/' + GoodsSeriesCode);
  };

  render () {
    const s = this.props.presell;
    return (
      <div className="goods_manage_page">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['商品管理', '商品众测']} />
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search} />
        </div>
        <div style={{ padding: '12px', backgroundColor: '#fff', minHeight: 'calc(100% - 160px)' }}>
          <Switch
            tabs={[{ label: '众测中', click: s.changeStat('众测中') }, { label: '众测成功', click: s.changeStat('众测成功') }, { label: '众测失败', click: s.changeStat('众测失败') }]}
            cur={s.curStatLabel}
          />
          <p style={{ fontSize: '12px', color: '#FFC600', fontWeight: 'bold', margin: '12px 0', padding: '6px 16px', backgroundColor: '#FFFBEF' }}>{s.renderTip}</p>
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

export default Presell;
