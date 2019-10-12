import React from 'react';
import { Button } from 'antd';
import GoodsItemIcon from './goods-item-icon';
import './styles.scss';

/**
 * 绘制订单项
 * @param {*} param0 订单
 */
function OrderItem ({ item, onSend }) {
  // 生产订单
  if (onSend) {
    return (
      <div className="design-item">
        <div className="design-no">
          <span>订单编号：{item.OrderNo}</span>
          <span style={{ float: 'right', color: '#4dbecd' }}>{item.OrderState === '0' ? '待付款' : item.OrderState === '1' ? '待发货' : item.OrderState === '2' ? '已发货' : '已完成'}</span>
        </div>
        <div className="design-content">
          <GoodsItemIcon src={item.GoodsPhoto} />
          <div className="design-title">
            <p>{item.GoodsName}</p>
            <p>{item.GoodsParamsExplain}</p>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>交货期：{item.DeliveryDate}</span>
              <span>￥{(item.TotalProductAmount / item.GoodsNumber).toFixed(2)}</span>
            </p>
            <p style={{ textAlign: 'right' }}>x{item.GoodsNumber}</p>
          </div>
          {/* <Button onClick={onClick}>发送设计</Button> */}
        </div>
        <div className="design-tail">
          <p style={{ marginBottom: 0 }}>
            共计<span style={{ marginRight: 10 }}>{item.GoodsNumber + item.GoodsSeriesUnit}商品</span>合计：<span style={{ color: '#ff6c6c' }}>{'￥' + item.TotalProductAmount}</span>
          </p>
        </div>
        {onSend && (
          <>
            <div className="send-button">
              <Button type="primary" onClick={onSend}>
                发送商品
              </Button>
            </div>
            <div className="tail-block" />
          </>
        )}
      </div>
    );
  } else {
    const data = item.MsgContent ? JSON.parse(item.MsgContent) : {};
    const { OrderNo, GoodsTitle, GoodsParamsExplain, GoodsSeriesPhotos, IsIncludeTax, GoodsKind, TotalProductAmount, TotalProductNumber, GoodsSeriesUnit, CompanyName, StoreName } = data;
    const GoodsPhoto = GoodsSeriesPhotos ? JSON.parse(GoodsSeriesPhotos)[0] : '';
    return (
      <div className="design-item msg">
        <div className="design-no">
          <p>订单提醒</p>
          <span style={{ color: '#999' }}>订单编号：{OrderNo}</span>
          {IsIncludeTax === '1' ? <span style={{ color: '#F5A623', border: '1px solid #F5A623', fontSize: 10, marginLeft: 5 }}>含税</span> : null}
        </div>
        <div className="design-content" style={{ borderBottom: '1px solid #EAEAEA' }}>
          <div className="img-container" style={{ position: 'relative' }}>
            <img src={GoodsPhoto} />
            {GoodsKind === '1' ? (
              <span className="pre_tip" style={{ color: '#FFF' }}>
                众测
              </span>
            ) : null}
          </div>
          <div className="design-title">
            <p>{GoodsTitle}</p>
            <p style={{ color: '#999' }}>{GoodsParamsExplain}</p>
            <p>{StoreName}</p>
            <p>合作工厂：{CompanyName}</p>
          </div>
        </div>
        <div className="design-tail" style={{ margin: '10px 0' }}>
          <p style={{ marginBottom: 0 }}>
            共计<span style={{ color: '#4dbecd' }}>{TotalProductNumber + GoodsSeriesUnit}</span>商品<span style={{ marginLeft: 10 }}>合计：{'￥' + TotalProductAmount}</span>
          </p>
        </div>
      </div>
    );
  }
}

export default OrderItem;
