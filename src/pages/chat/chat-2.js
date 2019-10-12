import React from 'react';
import { observer, inject } from 'mobx-react';
import './chat.scss';
import defaultHead from '@assets/img/image.png';
import ChatList from './components/chat-list';
import ChatAbout from './components/chat-about';
import ChatHistory from './components/chat-history';
import ChatSender from './components/chat-sender';
import { ToolBar } from './components/chat-tool';
import EmptyContent from './components/chat-none';
// import { Switch, Route, Redirect } from 'react-router-dom';
import { setMessagePage, setNormalPage } from '../../services/winref';

/**
 * chatList.current 改变导致 历史记录，发送器，About 组件重新加载 执行各自的init初始化
 * @param {*} param0
 * @param {*} param1
 */
@inject('chatApp', 'chatList', 'route')
@observer
class Chat extends React.Component {
  async componentDidMount () {
    await this.props.chatApp.init();
    setMessagePage();
  }
  componentWillUnmount () {
    setNormalPage();
  }
  render () {
    const { HeadImageUrl, CompanyName } = this.props.chatApp;
    const { current, chatDisplayName } = this.props.chatList;
    // console.log(toJS(conversations))
    return (
      <div className="chat-page">
        <div className="left-nav">
          <header className="my-header">
            <img src={HeadImageUrl ? HeadImageUrl : defaultHead} />
            {CompanyName}
          </header>
          <ChatList />
        </div>
        {(current && (
          <div className="center-content msg-content">
            <header className="header">{chatDisplayName}</header>
            <div className="bottom-content">
              <div className="messgae-content">
                <ChatHistory />
                <ToolBar />
                <ChatSender />
              </div>
              <div className="right-nav room">
                <ChatAbout />
              </div>
            </div>
          </div>
        )) || <EmptyContent />}
      </div>
    );
  }
}

export default Chat;
