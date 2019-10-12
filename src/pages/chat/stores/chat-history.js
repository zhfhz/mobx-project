import { observable, action, computed } from 'mobx';
import appStore from '@/pages/app/stores/app';
import defAvatar from '@assets/img/def_avatar.png';
import defaultHead from '@assets/img/image.png';
import { message } from 'antd';
import { getChatRecordById } from '@services/chat-api';
import { openNormalWindow } from '@services/winref';

/**
 * 处理聊天记录
 */
export class ChatHistoryStore {
  @observable fetching = false;
  @observable history = [];
  @observable totalAmount = 0;
  pageIndex = 1;
  pageSize = 10;

  @computed get current () {
    return this.app.chatList.current;
  }

  @action init = async () => {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.totalAmount = 0;
    this.update();
  };
  @action update = async () => {
    this.history = [];
    const { current, ClearRead } = this.app.chatList;
    // 获取聊天记录
    if (!current || !current.GroupId || current.GroupId.length < 10) return;
    const { Ok, ResultInfo, Data } = await getChatRecordById({
      RequestType: '1',
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      ChatTargetStyle: '0',
      ChatTargetType: current.ChatType,
      ChatTargetId: current.GroupId
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.totalAmount = Data.TotalCount;
    this.history = Data.Msgs ? Data.Msgs.reverse() : [];
    console.log(current);
    if (this.history.length && current.MsgUnreadCount !== 0) {
      await ClearRead(this.history[this.history.length - 1].MsgId);
    }
  };
  @action getMoreHistory = () => {
    // 点击查看聊天记录事件
    this.pageSize += 10;
    this.update();
  };
  getHeaderImgUrl = it => {
    // 聊天记录的头像
    const { MsgSenderInfo } = it;
    const { HeadImageUrl, MemStyle } = MsgSenderInfo;
    if (MemStyle === '4' || MemStyle === 4) {
      return HeadImageUrl || appStore.HeadImage || defaultHead;
    } else if (MemStyle === '2' || MemStyle === 2) {
      return HeadImageUrl || defAvatar;
    } else {
      return HeadImageUrl || '';
    }
  };
  getHeadName = it => {
    // 聊天记录的昵称(名字)
    // console.log(toJS(it))
    const { MsgSenderInfo } = it;
    const { StoreName, MemStyle, NickName } = MsgSenderInfo;
    const { targetName } = this.app.chatList.current;
    if (MemStyle === '4' || MemStyle === 4) {
      return appStore.CompanyName;
    } else if (MemStyle === '2' || MemStyle === 2) {
      return StoreName || targetName;
    } else {
      return '都市智造官方客服 ' + NickName;
    }
  };
  @action reset = () => {
    this.pageSize = 10;
    this.history = [];
    this.totalAmount = 0;
    this.update();
  };
  gotoPage = url => {
    console.log(url);
    openNormalWindow(url);
  };
  @action toDesignDetail = it => () => {
    const design = it && it.MsgContent ? JSON.parse(it.MsgContent) : {};
    const { GoodsSeriesCode } = design;
    const { gotoPage } = this;
    gotoPage('/design/choose/detail/' + GoodsSeriesCode);
  };
}
export default new ChatHistoryStore();
