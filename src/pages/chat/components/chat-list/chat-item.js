import React from 'react';
import './styles.scss';
import { Badge } from 'antd';
import { peekMsg, fromNow } from '../../stores/constant';
import group from '@/assets/img/群聊.png';

/**
 * 聊天列表项
 * @param {*} param0
 */
function ConversationItem ({ item, active, onClick, headerImageUrl, headerName }) {
  return (
    <div onClick={onClick} className={`conversation-item ${active ? 'active' : ''}`}>
      <Badge count={item.MsgUnreadCount} offset={[-10, 0]}>
        <img className="avatar" src={headerImageUrl} alt="头像" />
      </Badge>
      <div className="text">
        <span className="line-one">
          <span className="name" title={headerName}>
            {headerName}
          </span>
          {item.ChatType === '1' ? <img src={group} /> : null}
          <span>{item.updateTime && fromNow(item.updateTime)}</span>
        </span>
        <span className="peek-msg">{peekMsg(item.UnMsgType, item.UnMsgContent)}</span>
      </div>
    </div>
  );
}

export default ConversationItem;
