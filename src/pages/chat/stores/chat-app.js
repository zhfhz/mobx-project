import { observable, action, computed, extendObservable } from 'mobx';
import chatList from './chat-list';
import chatAbout from './chat-about';
import chatHistory from './chat-history';
import chatSender from './chat-sender';
import defaultHead from '@assets/img/image.png';
import appStore from '@/pages/app/stores/app';
import { connectChatServer } from '@services/chat-api';
import { message } from 'antd';
import { im } from '@services/im';
import { MsgType } from './constant';
import { routerStore } from '@/router-store';

/**
 * 处理聊天记录
 */
export class ChatAppStore {
  constructor () {
    const that = this;
    [chatList, chatAbout, chatHistory, chatSender].map(it => {
      extendObservable(it, {
        get app () {
          return that;
        }
      });
    });
  }
  @observable fetching = false;
  @computed get HeadImageUrl () {
    return appStore.HeadImage ? appStore.HeadImage : defaultHead;
  }
  @computed get CompanyName () {
    return appStore.CompanyName;
  }

  @computed get chatList () {
    return chatList;
  }
  @computed get chatAbout () {
    return chatAbout;
  }
  @computed get chatHistory () {
    return chatHistory;
  }
  @computed get chatSender () {
    return chatSender;
  }

  @action init = async () => {
    this.fetching = true;
    const res = await connectChatServer();
    this.fetching = false;
    if (res.ErrorCode !== 0) {
      message.error('聊天链接失败');
      return;
    }
    im.addMessageListener(this.onMessageArrived);
    im.addSysListener(this.onGroupDestoryed);
  };

  @action onGroupDestoryed = e => {

    /**
     * 拼接群组名称
     * @param {*} item 会话
     */
    // function _renderHeadName (item) {
    //   const { MemStyle, StoreName, RealName } = item.ChatTarget;
    //   if (item.ChatType === '1') {
    //     const list = item.ChatMembers.map(it => {
    //       return it.MemStyle === '4' ? it.CompanyName : it.MemStyle === '2' ? it.StoreName : '官方客服';
    //     });
    //     return list && list.reverse().join('、');
    //   } else {
    //     if (MemStyle === '2') {
    //       return StoreName;
    //     } else if (MemStyle === '3') {
    //       return '都市智造官方客服';
    //     } else {
    //       return RealName;
    //     }
    //   }
    // }
    const groupId = e.GroupId;
    const target = chatList.conversations.find(it => it.GroupId === groupId);
    if (target) {
      // notification.config({
      //   placement: 'bottomRight',
      //   duration: null
      // });
      // // 弹出通知
      // notification['info']({
      //   message: '会话解散通知！',
      //   description: `您的会话【${_renderHeadName(target)}】已被解散。`
      // });
      // 关闭会话 会话窗口
      chatList.reloadChatList();
      chatList.current = null;
      routerStore.push('/chat');
    }
  };

  @action onMessageArrived = async msgList => {
    const { reloadChatList, updateChatList } = chatList;
    for (let msg of msgList) {
      const found = chatList.conversations.find(it => it.GroupId === msg.GroupId);
      if (found) {
        // 找到会话
        found.updateTime = msg.MsgCreateTime;
        found.UnMsgType = msg.MsgType;
        found.UnMsgContent = msg.MsgContent;
        // console.log(toJS(room.current))
        if (chatList.current && chatList.current.GroupId === msg.GroupId) {
          found.MsgUnreadCount = 0;
          // room.current.MsgUnreadCount = 0;
          if (msg.MsgType === MsgType.system) {
            // 客服应答
            found.ChatMembers.push(msg.MsgSenderInfo);
            if (found.ChatMembers.length >= 3) {
              // 聊天人数>=3标记为群聊
              found.ChatType = '1';
            }
          }
          if (msg.MsgType === MsgType.tipQuit) {
            // 当前群组成员退群消息
            // 已退群名单
            const quitMember = found.ChatMembers.filter(it => {
              return msg.MsgContent.indexOf(it.UserId) > -1;
            });

            if (quitMember && quitMember.length > 0) {
              // 从缓存中删除
              found.ChatMembers = found.ChatMembers.map(it => {
                if (quitMember.indexOf(it) > -1) {
                  return null;
                }
                return it;
              }).filter(it => {
                return it !== null;
              });
              // 替换userId 为用户名
              msg.MsgContent = quitMember.map(it => {
                return it.CompanyName || it.NickName || it.RealName;
              });
              // 去掉群组标识
              found.ChatType = '0';
            }
          }
          // if(room.current && room.current.ChatTarget.MemStyle === '2' && msg.MsgSenderInfo.MemStyle === '3' &&  msg.MsgType==='System' &&  msg.MsgContent.indexOf('系统提示')!== -1 && room.IsServer) {
          //   Modal.info({
          //     title: '提示',
          //     content: '官方客服已在群聊中，您有问题可直接反馈，请勿重复邀请协作！',
          //     okText: '我知道了'
          //   })
          // }
          chatHistory.history.push(msg);
          if (msg.MsgId) {
            // 如果存在MsgId ，是对方的消息
            chatList.ClearRead(msg.MsgId);
          }
        } else {
          // 不是当前对话
          if (msg.MsgSenderInfo.UserId !== appStore.UserId && !found.useServerUnreadCount) {
            // 如果不是自己发的
            found.MsgUnreadCount += 1;
          } else {
            // 初次获取会话列表自带未读计数，使用后重置使用本地计数基数
            found.useServerUnreadCount = false;
          }
        }
      } else {
        // 重新拉取对话列表
        await reloadChatList();
        // 递归处理直到所有消息都找到对应的会话
        this.onMessageArrived(msgList);
      }
    }
    updateChatList();
  };

  @action update = () => {};
}
export default new ChatAppStore();
