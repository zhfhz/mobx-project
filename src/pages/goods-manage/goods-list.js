import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Search } from '../../components/search/search';
import { Switch } from '../../components/switch';
import { Etable } from '../../components/e-table';
import { Navigation } from '../../components/navigation/index';
import './style.scss';
import { TransverseRadios } from '../../components/transverse-radio/index';
import { Modal, InputNumber, Button } from 'antd';
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
        <div style={{ height: '80px', width: '320px', display: 'flex' }}>
          <div style={{ width: '80px', height: '80px' }}>
            <img alt="设计封面" src={row.GoodsPhoto} style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ flex: '1', paddingLeft: '15px' }}>
            <div style={{ marginBottom: '6px' }}>{row.GoodsSeriesTitle}</div>
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
            查看订单
          </a>
          &nbsp;&nbsp;
          <a href="javascript:void(0)" onClick={page.toStore.bind(this, row)} style={{ color: '#33CCCC' }}>
            实时库存
          </a>
          &nbsp;&nbsp;
        </span>
      );
    }
  }
];

@inject('goodsList')
@observer
class GoodsList extends Component {
  componentDidMount () {
    const s = this.props.goodsList;
    s.getData();
    s.getSecCateList();
  }
  componentWillUnmount () {
    const url = window.location.href;
    const { dispose } = this.props.goodsList;
    if (url.indexOf('/goods/list') === -1) {
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
          <span style={{ display: 'inline-block', width: '150px', verticalAlign: 'middle' }}>设计编号：{it.GoodsSeriesCode}</span>
          <span title={it.StoreName} style={{ display: 'inline-block', width: '150px', verticalAlign: 'middle', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {it.StoreName}
          </span>
          <span
            title={it.YunNum ? it.YunNum + it.GoodsSeriesUnit : '未添加'}
            style={{ display: 'inline-block', width: 150, verticalAlign: 'middle', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
          >
            库存：{it.YunNum ? it.YunNum + it.GoodsSeriesUnit : '未添加'}
          </span>
          <a href="javascript:void(0)" style={{ color: '#33CCCC' }} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}>
            <img src={store} style={{ marginRight: 5 }} />
            联系设计师
          </a>
        </span>
        <span>编辑时间：{it.EditWhen}</span>
      </div>
    );
  };

  toOrders = GoodsSeriesCode => {
    this.props.history.push('/goods/list/order/' + GoodsSeriesCode);
  };

  toDetail = GoodsSeriesCode => {
    this.props.history.push('/goods/list/detail/' + GoodsSeriesCode);
  };

  toStore = item => {
    const s = this.props.goodsList;
    s.curSeries = item;
    s.showStoreEdit = true;
    s.storeNumber = item.YunNum;
  };

  render () {
    const s = this.props.goodsList;
    return (
      <div className="goods_manage_page">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['商品管理', '常规商品']} />
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search} />
        </div>
        <div style={{ padding: '12px', backgroundColor: '#fff', minHeight: 'calc(100% - 160px)' }}>
          <TransverseRadios
            label="一级分类"
            value={s.curFirstCate ? s.curFirstCate.CategoryId : ''}
            options={s.firstCateList.map(c => ({
              label: c.CategoryName,
              val: c.CategoryId
            }))}
            onchange={s.switchFirstCate}
          />
          <TransverseRadios
            label="二级品类"
            value={s.curSecCate ? s.curSecCate.CategoryId : ''}
            options={s.secCateList.map(c => ({
              label: c.CategoryName,
              val: c.CategoryId
            }))}
            onchange={s.switchSecCate}
          />
          <br />
          <Switch tabs={[{ label: '已上架', click: s.changeStat('已上架') }, { label: '已下架', click: s.changeStat('已下架') }]} cur={s.curStatLabel} />
          <p style={{ fontSize: '12px', color: '#FFC600', fontWeight: 'bold', margin: '12px 0', padding: '6px 16px', backgroundColor: '#FFFBEF' }}>
            {s.GoodsState === '1' ? '温馨提示：上架中商品为正在都市智造APP中销售的常规商品' : '温馨提示：下架商品可选择编辑或者直接上架至都市智造'}
          </p>
          {s.tableDataDisplay.length ? (
            <Etable columns={cols(this)} data={s.tableDataDisplay} rowItem={this.row} pagination={{ ...s.paging }} />
          ) : (
            <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
          )}
        </div>
        <Modal
          visible={s.showStoreEdit}
          title="实时库存"
          footer={
            <div>
              <Button type="default" onClick={s.closeModal}>
                取消
              </Button>
              <Button type="primary" onClick={s.editStoreNumber}>
                确定
              </Button>
            </div>
          }
          onCancel={s.closeModal}
          className="storeEdit"
        >
          <div>
            <label>实时库存：</label>
            <InputNumber step={1} precision={0} placeholder="请输入实时库存" onChange={s.storeChange} value={s.storeNumber} />
            &nbsp;&nbsp;{s.curSeries.GoodsSeriesUnit}
            <p style={{ marginTop: 10, color: 'red' }}>说明：库存可随时修改，请确认好再填写，便于设计师销售产品</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default GoodsList;
