import React from 'react';
import { Button, Input } from 'antd';
import { inject, observer } from 'mobx-react';
import './styles.scss';

const { TextArea } = Input;

@inject('chatSender')
@observer
class ChatSender extends React.Component {
  render () {
    const { updateInput, inputDown, sending, input, signed, sendMessage } = this.props.chatSender;
    return (
      <>
        <TextArea ref={this._attachInput} placeholder="请输入聊天内容（Shift + Enter 输入回车）" className="chat-input" value={input} onChange={updateInput} onKeyDown={inputDown} />
        <div className="chat-send">
          <Button loading={sending} disabled={!signed || !input} className="send-btn" type="primary" onClick={sendMessage}>
            发送{sending ? '中' : ''}
          </Button>
        </div>
      </>
    );
  }
}

export default ChatSender;
