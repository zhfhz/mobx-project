import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import guanbi from '@assets/img/guanbi.png';
import { inject, observer } from 'mobx-react';

@inject('chatList')
@observer
class CloseChatBtn extends Component {
  closeChat = () => {
    const { closeChat } = this.props.chatList;
    closeChat();
  };

  render () {
    return (
      <div>
        <Popconfirm title="确定退出当前聊天室?" onConfirm={this.closeChat} okText="确认" cancelText="取消">
          <img src={guanbi} alt="🌤" title="挂断" />
        </Popconfirm>
      </div>
    );
  }
}

export default CloseChatBtn;
