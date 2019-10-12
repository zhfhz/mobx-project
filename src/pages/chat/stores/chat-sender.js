import { observable, action } from 'mobx';
import { sendDataRequest } from '@services/chat-api';
import appStore from '../../app/stores/app';
import { UserType } from './constant';
import uuid from 'uuid/v1';
import { message } from 'antd';
import { oss } from '@services/oss';

/**
 * 控制 活跃会话，消息接收，会话切换，会话列表
 */
export class ChatSenderStore {
  @observable signed = false;
  @observable input = '';
  @observable emojiList = '😂-😱-😭-😘-😳-😒-😏-😄-😔-😍-😉-😜-😁-😝-😰-😓-😚-😌-😊-💪-👊-👍-☝-👏-✌-👎-🙏-👌-👈-👉-👆-👇-👀-👃-👄-👂-🍚-🍝-🍜-🍙-🍧-🍣-🎂-🍞-🍔-🍳-🍟-🍺-🍻'.split('-');
  @observable showEmoji = false;
  @observable sending = false;

  @action init = async () => {};

  stringFilter (str) {
    const DQ = '"'; // 双引号
    const SQ = '"'; // 单引号
    return str.replace(/'/gm, SQ).replace(/"/gm, DQ); // 单引号
  }
  @action sendData = async (type, content) => {
    const { chatList } = this.app;
    content = content.replace(/^\s+|\s+$/, '');
    if (!chatList.current) return;
    this.sending = true;
    const target = chatList.current.ChatTarget;
    // console.log(target)
    const msg = {
      MsgContent: content,
      ChatSenderId: appStore.UserId,
      ChatSenderStyle: UserType.factory,
      // 如果当前会话已连接，targetId传groupId,targetStyle传'0'
      // 如果当前会话未连接(且MemStyle === '3')，targetId传''(且MemStyle !== '3',传UserId),targetStyle传MemStyle
      ChatTargetId: chatList.current.GroupId !== '0001' && chatList.current.GroupId !== '123456' ? chatList.current.GroupId : target.MemStyle === '3' ? '' : target.UserId,
      ChatTargetStyle: chatList.current.GroupId !== '0001' && chatList.current.GroupId !== '123456' ? '0' : target.MemStyle,
      MsgNo: uuid(),
      MsgType: type || 'Text'
    };

    const { Ok } = await sendDataRequest(msg);
    this.sending = false;
    if (!Ok) {
      message.error('发送失败');
    } else {
      // 发送成功，对聊天列表重新排序
      chatList.setCurrentTheTop1();
    }
    return { Ok };
  };
  @action greetToCustomer = async () => {
    const msg = {
      MsgContent: '你好',
      ChatSenderId: appStore.UserId,
      ChatSenderStyle: UserType.factory,
      // 如果当前会话已连接，targetId传groupId,targetStyle传'0'
      // 如果当前会话未连接(且MemStyle === '3')，targetId传''(且MemStyle !== '3',传UserId),targetStyle传MemStyle
      ChatTargetId: '',
      ChatTargetStyle: '3',
      MsgNo: uuid(),
      ChatTargetType: '0',
      MsgType: 'Text'
    };

    const { Ok } = await sendDataRequest(msg);
    return { Ok };
  };
  @action greetToDesign = async userId => {
    const msg = {
      MsgContent: '你好',
      ChatSenderId: appStore.UserId,
      ChatSenderStyle: UserType.factory,
      // 如果当前会话已连接，targetId传groupId,targetStyle传'0'
      // 如果当前会话未连接(且MemStyle === '3')，targetId传''(且MemStyle !== '3',传UserId),targetStyle传MemStyle
      ChatTargetId: userId,
      ChatTargetStyle: '2',
      MsgNo: uuid(),
      ChatTargetType: '0',
      MsgType: 'Text'
    };

    const { Ok } = await sendDataRequest(msg);
    return { Ok };
  };
  @action sendMessage = async () => {
    const msg = this.stringFilter(this.input);
    this.sendData('Text', msg);
    this.input = '';
  };
  @action sendImage = async imgUrl => {
    this.sendData('Image', imgUrl);
  };
  @action sendFile = async (fileUrl, fileName, fileSize) => {
    const fileObj = {
      FileName: fileName,
      FilePath: fileUrl,
      FileSize: fileSize
    };
    this.sendData('File', JSON.stringify(fileObj));
  };
  @action validFileAndSend = async (type, file) => {
    const promise = new Promise(async resolve => {
      let fileType = '';
      let suffix = '';
      if (!file) {
        return resolve({
          status: false,
          msg: '文件无效'
        });
      }
      if (file) {
        fileType = file.type;
        suffix = file.name.match(/[^.]+$/) && file.name.match(/[^.]+$/)[0];
        if (fileType.indexOf('x-msdownload') !== -1 || suffix === 'exe') {
          message.warn('文件格式错误，请重新选择');
          resolve({
            status: false,
            msg: '文件格式错误，请重新选择'
          });
        }
        // if (fileSize > 5) {
        //   message.warn('文件大小超出范围！')
        //   return false
        // }
      }
      // Loading()
      if (type === 'image' && fileType.indexOf('image') >= 0) {
        const result = await oss.put(file);
        if (result.res.status === 200 && result.res['statusCode'] === 200) {
          this.sendImage(result['url']);
        } else {
          message.error('上传失败');
          return resolve({
            status: false,
            msg: '上传失败'
          });
        }
      } else if (type === 'image' && fileType.indexOf('image') < 0) {
        message.warn('文件格式错误，请重新选择');
        return resolve({
          status: false,
          msg: '文件格式错误，请重新选择'
        });
      }
      if (type === 'file') {
        const result = await oss.filePut(file);
        if (result.res.status === 200 && result.res['statusCode'] === 200) {
          this.sendFile(result['url'], file.name, file.size);
        } else {
          message.error('上传失败');
          return resolve({
            status: false,
            msg: '上传失败'
          });
        }
      }
      return resolve({
        status: true,
        msg: '发送成功'
      });
    });

    return promise;
  };
  @action sendDesign = async it => {
    // 发送设计
    const obj = {
      GoodsPhoto: it.GoodsPhoto,
      GoodsSeriesCode: it.GoodsSeriesCode,
      GoodsSeriesTitle: it.GoodsSeriesTitle,
      GoodsKind: it.GoodsKind,
      DesignState: it.DesignState,
      // RequestType: it.RequestType,
      DesignRate: it.DesignRate,
      CompanyName: it.CompanyName,
      StoreName: it.StoreName,
      IsCoop: it.IsCoop,
      IsSetGoodsKind: it.IsSetGoodsKind
    };
    this.sendData('Design', JSON.stringify(obj));
  };
  @action sendGoods = async GoodsSeriesCode => {
    this.sendData('Goods', GoodsSeriesCode);
  };
  @action sendOrder = async OrderNo => {
    this.sendData('Order', OrderNo);
  };
  @action updateInput = e => {
    if (!this.signed || this.sending) return;
    this.input = e.target.value.replace(/^\s+$/, '');
  };

  @action reciveToolBarInput = (type, content) => {
    switch (type) {
    case 'emoji':
      this.input += content;
      break;
    case 'img':
      break;
    case 'file':
      break;
    default:
      break;
    }
  };
  @action inputDown = e => {
    if (!e.shiftKey && e.keyCode === 13) {
      if (this.input) {
        this.sendMessage();
      } else {
        e.preventDefault();
      }
    }
  };
  @action disable = () => {
    this.input = '';
    this.signed = false;
  };

  @action enable = () => {
    this.signed = true;
  };
  @action showEmojiHandle = e => {
    e.stopPropagation();
    this.showEmoji = !this.showEmoji;
  };

  @action hideEmoji = () => {
    if (this.showEmoji) {
      this.showEmoji = false;
    }
  };
  @action _choose = e => () => {
    this.updateEmoji(e);
  };
  @action updateEmoji = e => {
    this.input += e;
  };
}
export default new ChatSenderStore();
