import React from 'react';
import { inject, observer } from 'mobx-react';
import { showTime } from '../../stores/constant';
import './styles.scss';
import DesignItem from '../chat-msg/design-item';
import GoodsItem from '../chat-msg/goods-item';
import OrderItem from '../chat-msg/order-item';
import FileItem from '../chat-msg/file-item';
import ImgItem from '../chat-msg/img-item';
import recode from '@assets/img/记录.png';
import appStore from '@/pages/app/stores/app';

@inject('chatHistory')
@observer
class ChatHistory extends React.Component {
  _attachWrap = ref => (this.wrap = ref);
  componentDidMount () {
    this.wrap.scrollTop = this.wrap.scrollHeight;
    const that = this;
    this.wrap.addEventListener('mousewheel', function () {
      if (this.scrollTop > this.scrollHeight - this.clientHeight - 200) {
        that.stopAutoScrollEnd = false;
      } else {
        that.stopAutoScrollEnd = true;
      }
    });
    this.props.chatHistory.init();
  }
  historyUpdated = () => {
    if (!this.stopAutoScrollEnd) {
      this.wrap.scrollTop = this.wrap.scrollHeight;
    }
  };

  listeningHistoryRender = idx => {
    const { chatHistory } = this.props;
    if (this.wrap && chatHistory.history.length - 1 <= idx) {
      this.historyUpdated();
    }
  };

  _renderGroupMsg = it => {
    it = JSON.parse(JSON.stringify(it));
    const { getHeaderImgUrl, getHeadName, toDesignDetail } = this.props.chatHistory;
    if (it.MsgType === 'System') {
      return (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <span style={{ backgroundColor: '#f8f8f8', padding: '4px 10px' }}>
            {it.MsgContent.indexOf('系统提示：官方客服 娜娜为您服务') !== -1 ? '系统提示：官方客服 ' + it.MsgSenderInfo.NickName + '为您服务' : ''}
          </span>
        </div>
      );
    } else if (it.MsgType === 'GroupTip_Join') {
      // return (
      //   <div style={{ textAlign: 'center', margin: '15px 0' }}>
      //     <span style={{ backgroundColor: '#f8f8f8', padding: '4px 10px' }}>已邀请客服加入聊天，请等待客服应答。</span>
      //   </div>
      // );
      return null;
    } else if (it.MsgType === 'GroupTip_Quit') {
      // if (it.MsgContent.length <= 0) {
      //   return <div />;
      // }
      // return (
      //   <div style={{ textAlign: 'center', margin: '15px 0' }}>
      //     <span style={{ backgroundColor: '#f8f8f8', padding: '4px 10px' }}>{`${it.MsgContent.join(' , ')} 已离开。`}</span>
      //   </div>
      // );
      return null;
    } else {
      if (!it.MsgContent.replace(/\^\s*|\s*$/, '')) {
        // 不展示无效消息
        return null;
      }
      // 去除头尾空格
      it.MsgContent = it.MsgContent.replace(/\^\s+|\s+$/, '');
      return (
        <div className={`msg-item ${it.MsgSenderInfo.UserId === appStore.UserId ? 'right' : ''}`}>
          <div className="avatar">
            <img src={getHeaderImgUrl(it)} alt="头像" />
          </div>
          <div className="content">
            <div className="name">{getHeadName(it)}</div>
            <div className="bubble">
              {it.MsgType === 'Text' ? <div className="text">{it.MsgContent}</div> : null}
              {it.MsgType === 'Design' ? <DesignItem item={it} toDetail={toDesignDetail(it)} /> : null}
              {it.MsgType === 'Goods' ? <GoodsItem item={it} /> : null}
              {it.MsgType === 'Order' ? <OrderItem item={it} /> : null}
              {it.MsgType === 'Image' ? <ImgItem item={it} /> : null}
              {it.MsgType === 'File' ? <FileItem item={it} /> : null}
            </div>
          </div>
        </div>
      );
    }
  }
  render () {
    // 聊天记录
    const { history, pageSize, totalAmount, getMoreHistory } = this.props.chatHistory;
    // console.log(history.length, pageSize, totalAmount)
    // console.log(toJS(history))
    return (
      <div className="history" ref={this._attachWrap}>
        {history && pageSize < totalAmount ? (
          <p style={{ textAlign: 'center', margin: '10px 0' }}>
            <a
              href="javascript: void(0)"
              style={{ fontSize: '10px', textDecoration: 'underline', padding: '2px 6px', borderRadius: '4px' }}
              onClick={() => {
                this.stopAutoScrollEnd = true;
                getMoreHistory();
              }}
            >
              <img src={recode} style={{ margin: '0 5px 4px 0' }} />
              获取聊天记录
            </a>
          </p>
        ) : (
          ''
        )}
        {history.map((it, idx) => (
          <div
            key={it.MsgId}
            ref={() => {
              this.listeningHistoryRender(idx);
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span className="">{showTime(idx, history)}</span>
            </div>
            {this._renderGroupMsg(it)}
          </div>
        ))}
      </div>
    );
  }
}

export default ChatHistory;
