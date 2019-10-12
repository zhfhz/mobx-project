import { observable, action, computed } from 'mobx';
import { getLastChatRecord, clearUnreadInfo, askCustomerToTheGroup } from '@services/chat-api';
import { closeChat } from '@services/chat-api';
import { message, Modal } from 'antd';
import appStore from '@/pages/app/stores/app';
import { UserType } from './constant';
import { routerStore } from '@/router-store';
import defAvatar from '@assets/img/def_avatar.png';
import kefu from '@assets/img/kefuHead.png';

/**
 * 控制 活跃会话，消息接收，会话切换，会话列表
 */
export class ChatListStore {
  @observable _conversations = [];
  @observable HeadImageUrl = appStore.HeadImage;
  @observable CompanyName = appStore.CompanyName;
  @observable fetching = false;
  @observable current = null;
  @observable _targetName = '';
  @observable visible = false;

  @computed get targetName () {
    return this.current && this.current.ChatTarget.CompanyName + ' ' + (this.current.ChatTarget.NickName || this.current.ChatTarget.RealName);
  }
  @computed get chatDisplayName () {
    const { current, getTargetHeaderName } = this;
    return current && (current.ChatType === '1' ? '群聊' : current.ChatTarget.MemStyle === '2' ? getTargetHeaderName(current) : '都市智造官方客服');
  }
  @computed get conversations () {
    return this._conversations;
  }

  set conversations (data) {
    data.forEach(it => {
      it.updateTime = it.UnMsgCreateTime;
    });
    this._conversations.replace(data.slice().sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()));
  }

  // @observable groupId = '';
  // @observable targetUserId = '';
  @action init = async config => {
    this.app.chatSender.disable();
    await this.fetchChatList();
    // 打开会话
    if (config) {
      this.openChatWith(config.targetId, config.targetName);
      this.app.chatSender.enable();
    }
  };
  @action reloadChatList = async () => {

    /**
     * 重新拉取聊天列表的场景是 新消息到来时，找不到消息对应的聊天
     */
    this._conversations = [];
    await this.fetchChatList();
    const groupId = routerStore.location.pathname.split('/')[2];
    if (groupId === '0001') {
      this.current = this.conversations.find(it => it.ChatTarget.MemStyle === '3');
      // 更新URL地址
      routerStore.history.push(`/chat/${this.current.ChatTarget.UserId || this.current.GroupId}/${this.getTargetHeaderName(this.current)}`);
    } else {
      this.current = this.conversations.find(it => it.ChatTarget.UserId === groupId);
      if (!this.current) return;
      routerStore.history.push(`/chat/${this.current.ChatTarget.UserId || this.current.GroupId}/${this.getTargetHeaderName(this.current)}`);
    }
  };
  @action fetchChatList = async () => {
    if (this.conversations.length > 0) {
      return;
    }
    this.fetching = true;
    const { Ok, Data } = await getLastChatRecord();
    this.fetching = false;
    if (Ok) {
      this.conversations = Data.map(it => {
        if (it.MsgUnreadCount) {
          // 接口自带未读计数
          it.useServerUnreadCount = true;
        }
        return it;
      });
    } else {
      message.error('获取会话内容失败');
    }
  };

  @action openChatWith = async (targetId, targetName) => {
    if (targetId === '0001') {
      // 打开官方客服的窗口
      const kefu = this.conversations.find(it => it.ChatTarget.MemStyle === '3' && it.ChatType === '0');
      if (kefu && !kefu.isTemp) {
        // kefu.isTemp=true表明是假数据
        const { getTargetHeaderName } = this;
        // 对话列表中包含官方客服，更新正确的URL
        routerStore.history.push(`/chat/${kefu.GroupId}/${getTargetHeaderName(kefu)}`);
        return;
      }
    }
    // 尝试打开指定对话窗口
    this._targetName = targetName;
    const found = this.conversations.find(it => targetId === it.ChatTarget.UserId /** && it.ChatType === '0' **/ || targetId === it.GroupId);
    if (found) {
      this.current = found;
    } else {
      this.createTalkByGreeting(targetId, targetName);
    }
  };
  @action createTalkByGreeting = (targetId, targetName) => {
    // 等待用户发送消息创建会话，并打开
    const newList = this.conversations.slice(0);
    newList.unshift({
      isTemp: true, // 标记为临时数据
      MsgUnreadCount: 0,
      UnMsgContent: '',
      ChatMembers: [],
      ChatType: '0',
      ChatTarget: {
        MobileNumber: '',
        RealName: '',
        StoreName: targetName,
        UserId: targetId === '0001' ? '0001' : targetId,
        CompanyName: '',
        HeadImageUrl: '',
        CompanyID: '',
        NickName: '',
        MemStyle: targetId === '0001' ? '3' : '2'
      },
      NowTime: '',
      GroupId: targetId === '0001' ? '0001' : '123456',
      UnMsgCreateTime: '',
      UnMsgType: 'Text',
      IsAnswer: '0'
    });
    this.conversations.replace(newList);
    this.current = newList[0];
  };
  // 消息回执
  @action ClearRead = async id => {
    console.log(id);
    clearUnreadInfo(id);
    this.current.MsgUnreadCount = 0;
    this.updateChatList();
  };

  @action updateChatList = () => {
    this.conversations.replace(this.conversations.slice(0));
  };
  @action setCurrentTheTop1 = () => {
    const newList = this.conversations.slice(0).filter(it => it !== this.current);
    newList.unshift(this.current);
    this._conversations = newList;
  };
  @action removeChat = groupId => {
    const chatTarget = this.conversations.find(it => it.GroupId === groupId);
    if (chatTarget) {
      let pos = this.conversations.indexOf(chatTarget);
      let newConversations = this.conversations.slice(0);
      newConversations.splice(pos, 1);
      this.conversations = newConversations;
      this.current = null;
    }
  };

  @action closeChat = async () => {
    const { chatList } = this.app;
    const groupId = chatList.current.GroupId;
    const memStyle = chatList.current.ChatTarget.MemStyle;
    const success = await closeChat(groupId, memStyle);
    if (success) {
      routerStore.push('/chat');
      this.removeChat(groupId);
    }
  };

  @action chatItemClick = it => {
    const { getTargetHeaderName } = this;
    if ((it.GroupId && routerStore.location.pathname.split('/').indexOf(it.GroupId) > -1) || (it.ChatTarget.UserId && routerStore.location.pathname.split('/').indexOf(it.ChatTarget.UserId) > -1)) {
      return;
    }
    const targetUrl = `/chat/${it.ChatTarget.UserId || it.GroupId}/${getTargetHeaderName(it)}`;
    console.log(targetUrl);
    routerStore.history.push(targetUrl);
    this.current = null;
  };

  getTargetHeaderImageUrl (target) {
    const { MemStyle, HeadImageUrl } = target.ChatTarget;
    if (MemStyle === '2') {
      return HeadImageUrl || defAvatar;
    } else if (MemStyle === '3') {
      return HeadImageUrl || kefu;
    }
  }

  getTargetHeaderName (target) {
    const { MemStyle, StoreName, RealName } = target.ChatTarget;
    if (target.ChatType === '1') {
      const list = target.ChatMembers.map(it => {
        return it.MemStyle === '4' ? it.CompanyName : it.MemStyle === '2' ? it.StoreName : '官方客服';
      });
      return list && list.reverse().join('、');
    } else {
      if (MemStyle === '2') {
        return StoreName;
      } else if (MemStyle === '3') {
        return '都市智造官方客服';
      } else {
        return RealName;
      }
    }
  }

  @action handleCancel = () => {
    this.visible = false;
  };

  @action askServer = () => {
    // 邀请官方客服协作的提示框
    if (this.current.ChatMembers.find(it => it.MemStyle == UserType.server)) {
      this.visible = true;
    } else {
      Modal.confirm({
        title: '邀请官方客服协作',
        content: '确认邀请吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: this.askServerIndeed
      });
      return;
    }
  };

  @action askServerIndeed = async () => {
    if (!this.current || !this.current.GroupId) return;
    const { Ok, ResultInfo } = await askCustomerToTheGroup(this.current.GroupId);
    if (Ok) {
      message.success('邀请成功，请等待');
    } else {
      message.warn(ResultInfo);
    }
  };
}

export default new ChatListStore();
