import React from 'react';
import './styles.scss';
import noneMsg from '@assets/img/none-msg.png';
import noneOrder from '@assets/img/none-order.png';

/**
 * 默认聊天内容
 */
export default function EmptyContent () {
  return (
    <div className="msg-content">
      <header className="header" />
      <div className="bottom-content">
        <div className="none-content">
          <img className="none" src={noneMsg} />
          <p>请点击左侧会话聊天列表参与聊天</p>
        </div>
        <div className="right-nav">
          <img className="none" src={noneOrder} />
          <p>暂无消息</p>
        </div>
      </div>
    </div>
  );
}
