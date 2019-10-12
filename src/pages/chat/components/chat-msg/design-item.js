import React from 'react';
import { Button } from 'antd';
import GoodsItemIcon from './goods-item-icon';
import './styles.scss';

/**
 * 绘制设计项
 * @param {*} param0 设计Object
 */
function DesignItem ({ item, onSend, toDetail }) {
  item = onSend ? item : JSON.parse(item.MsgContent);
  // 选择设计列表
  return (
    <div className={`design-item ${toDetail ? 'display-cursor' : ''}`} onClick={toDetail}>
      <div className="design-no">
        <span>设计编号：{item.GoodsSeriesCode}</span>
        <span style={{ float: 'right' }}>{item.DesignState === '3' ? '已合作' : '待选择'}</span>
      </div>
      <div className="design-content">
        <GoodsItemIcon src={item.GoodsPhoto} />
        <div className="design-title">
          <p>{item.GoodsSeriesTitle}</p>
          <p>
            设计师{(item.DesignRate * 100).toFixed(0) + '%'}&nbsp;|&nbsp;工厂{(100 - item.DesignRate * 100).toFixed(0) + '%'}
          </p>
          {onSend && <p>{item.StoreName}</p>}
          {!onSend && item.IsCoop === '1' ? <p style={{ color: '#999' }}>合作工厂：{item.CompanyName}</p> : null}
        </div>
        {/* <Button onClick={onClick}>发送设计</Button> */}
      </div>
      {!onSend && (
        <div className="design-tail" style={{ margin: '10px 0', textAlign: 'right' }}>
          <p style={{ marginBottom: 0, padding: 0 }}>{item.StoreName}</p>
        </div>
      )}
      {onSend && (
        <>
          <div className="send-button">
            <Button type="primary" onClick={onSend}>
              发送设计
            </Button>
          </div>
          <div className="tail-block" />
        </>
      )}
    </div>
  );
}

export default DesignItem;
