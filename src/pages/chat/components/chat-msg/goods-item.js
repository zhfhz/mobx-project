import React from 'react';
import { Button } from 'antd';
import GoodsItemIcon from './goods-item-icon';
import './styles.scss';

/**
 * 绘制已发布的商品项
 * @param {*} param0 商品项
 */
function GoodsItem ({ item, onSend }) {
  item = onSend ? item : JSON.parse(item.MsgContent);
  // 聊天记录的消息类型为Goods
  const {
    GoodsSeriesCode,
    GoodsSeriesTitle,
    GoodsPhoto,
    GoodsSeriesIcon = GoodsPhoto,
    GoodsSeriesSetNum,
    GoodsKind,
    PresellNum,
    EndTime,
    GoodsSeriesUnit,
    NowMarketNoTax,
    GoodsPriceMin = NowMarketNoTax
  } = item;
  return (
    <div className="design-item">
      <div className="design-no">
        <p>{GoodsKind === '1' ? '众测商品' : '常规商品'}</p>
        <span style={{ color: '#999' }}>商品ID：{GoodsSeriesCode}</span>
      </div>
      <div className="design-content" style={{ borderBottom: '1px solid #EAEAEA', paddingBottom: GoodsKind === '1' ? '0' : '1em' }}>
        <GoodsItemIcon src={GoodsSeriesIcon} desc="众测" />
        <div className="design-title">
          <p>{GoodsSeriesTitle}</p>
          {GoodsKind === '1' ? (
            <div>
              <p style={{ color: '#666' }}>截止日期：{EndTime}</p>
              <p style={{ color: '#666' }}>众测数量：{PresellNum + GoodsSeriesUnit}</p>
            </div>
          ) : null}
          {GoodsKind === '0' ? <p>{GoodsSeriesSetNum ? '起订量：' + GoodsSeriesSetNum + GoodsSeriesUnit : ''}</p> : null}
          {onSend && (
            <p style={{ color: 'rgb(255, 108, 108)', textAlign: 'right' }}>
              <span style={{ color: '#FF0000' }}>{GoodsPriceMin}</span>元/起
            </p>
          )}
        </div>
      </div>
      {!onSend && (
        <div className="design-tail" style={{ margin: '10px 0' }}>
          <p style={{ marginBottom: 0, padding: 0 }}>
            <span style={{ color: '#FF0000' }}>{GoodsPriceMin}</span>元/起
          </p>
        </div>
      )}
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
}

export default GoodsItem;
