import React from 'react';
import './styles.scss';
import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import noneChat from '@assets/img/none-chat.png';
import ChatItem from './chat-item';

@inject('chatList', 'route')
@observer
class ChatList extends React.Component {
  async componentDidMount () {
    const { location } = this.props.route;
    const argvs = location.pathname.match(/\/chat\/([^/]+)\/([^/]+)$/);
    await this.props.chatList.init(
      argvs
        ? {
          targetId: argvs[1],
          targetName: argvs[2]
        }
        : null
    );
  }
  renderFactoryChatList = () => {
    const chatList = this.props.chatList;
    const { fetching, current, getTargetHeaderImageUrl, getTargetHeaderName, chatItemClick } = chatList;
    return (
      <Spin spinning={fetching}>
        {chatList.conversations.length ? (
          chatList.conversations.map(it => (
            <ChatItem
              key={it.GroupId}
              item={it}
              onClick={() => {
                chatItemClick(it);
              }}
              headerImageUrl={getTargetHeaderImageUrl(it)}
              headerName={getTargetHeaderName(it)}
              active={current && current.ChatTarget.UserId === it.ChatTarget.UserId}
            />
          ))
        ) : (
          <div className="none-chat">
            <img className="none" src={noneChat} />
            <p>暂无聊天消息</p>
          </div>
        )}
      </Spin>
    );
  };
  renderDesignerChatList = () => {
    return <ChatItem />;
  };

  render () {
    return this.renderFactoryChatList();
  }
}

export default ChatList;
