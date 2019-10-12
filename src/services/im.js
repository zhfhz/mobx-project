/* eslint-disable */
// @ts-nocheck
import { webim } from './webim';
import { http } from './http';
import appStore from '../pages/app/stores/app';
import _ from 'lodash';
import moment from 'moment';

const msgListeners = [];
const systemMsgListeners = [];
// 群提示消息类型
const WEB_IM_GROUP_TIP_TYPE = {
  JOIN: 1, // 加入群组
  QUIT: 2, // 退出群组
  KICK: 3, // 被踢出群组
  SET_ADMIN: 4, // 被设置为管理员
  CANCEL_ADMIN: 5, // 被取消管理员
  MODIFY_GROUP_INFO: 6, // 修改群资料
  MODIFY_MEMBER_INFO: 7 // 修改群成员信息
};

// 消息元素类型
var MSG_ELEMENT_TYPE = {
  TEXT: 'TIMTextElem', // 文本
  FACE: 'TIMFaceElem', // 表情
  IMAGE: 'TIMImageElem', // 图片
  CUSTOM: 'TIMCustomElem', // 自定义
  SOUND: 'TIMSoundElem', // 语音,只支持显示
  FILE: 'TIMFileElem', // 文件,只支持显示
  LOCATION: 'TIMLocationElem', // 地理位置
  GROUP_TIP: 'TIMGroupTipElem' // 群提示消息,只支持显示
};

/**
 * build object when msg type was not type of CustomMsg
 * @param {*} msg webIm Msg Object
 */
function handleDefaultMsg(msg) {
  const elem = _.get(msg, 'elems[0]');
  let defaultData = null;
  // console.log('msg: ', it)
  if (MSG_ELEMENT_TYPE.GROUP_TIP === elem.getType()) {
    switch (elem.getContent().getOpType()) {
      case WEB_IM_GROUP_TIP_TYPE.JOIN:
        // 已邀请客服加入，等待客服应答
        defaultData = {
          GroupId: elem.getContent().groupId,
          MsgContent: elem.getContent().userIdList,
          MsgCreateTime: moment(msg.time * 1000).format('YYYY-MM-DD hh:mm:ss'),
          MsgId: '', // 系统信息不需要
          MsgSenderInfo: {
            UserId: 'System'
          },
          MsgType: 'GroupTip_Join',
          Seq: msg.seq,
          Time: msg.time
        };
        break;
      case WEB_IM_GROUP_TIP_TYPE.KICK:
        // 处理退出
        defaultData = {
          GroupId: elem.getContent().groupId,
          MsgContent: elem.getContent().userIdList,
          MsgCreateTime: moment(msg.time * 1000).format('YYYY-MM-DD hh:mm:ss'),
          MsgId: '', // 系统信息不需要
          MsgSenderInfo: {
            UserId: 'System'
          },
          MsgType: 'GroupTip_Quit'
        };
        break;
      default:
        break;
    }
  }
  return defaultData;
}

/**
 * recevie CustomMsg, GroupMsg
 * @param {*} msgList webIm Msg<Array>
 */
function _onMsgNotify(msgList) {
  msgList = msgList.map(it => {
    const elem = _.get(it, 'elems[0]');
    // 处理自定义消息，如果非自定义消息使用其他处理
    let data = _.get(elem, ['content', 'data'], JSON.stringify(handleDefaultMsg(it)));
    try {
      data = JSON.parse(data);
      if (data) {
        data.IsSend = data.MsgSenderInfo.UserId === appStore.UserId;
        data.Seq = it.seq;
        data.Time = moment(it.time * 1000).format('YYYY-MM-DD hh:mm:ss');
        // it.data = data
      }
    } catch (e) {
      console.log('消息内容为原生内容');
    }
    return data;
  });
  // 过滤无效消息
  const newMsgList = [];
  msgList.forEach(it => {
    if (it) {
      newMsgList.push(it);
    }
  });
  msgListeners.forEach(it => {
    if (it instanceof Function) {
      it(newMsgList);
    }
  });
}

/**
 * 群解散回调
 * @param {*} e 事件
 */
function _onDestoryGroupNotify(e) {
  console.log('群解散： ', e);
  systemMsgListeners.forEach(it => {
    if (it instanceof Function) {
      it(e);
    }
  });
}

/**
 * 登陆webim聊天
 */
async function _login() {
  if (webim.checkLogin()) {
    return {
      ErrorCode: 0
    };
  }

  const { Ok, Data } = await http.get('/get/usersig', { Identifier: appStore.user.UserID });
  if (!Ok) {
    return {
      ErrorCode: 1,
      ErrorInfo: '无账号'
    };
  }
  const { UserSig: userSig } = Data;
  return new Promise(resolve => {
    webim.login(
      {
        accountType: 36862,
        sdkAppID: '1400194920',
        identifier: appStore.UserId,
        userSig
      },
      {
        onConnNotify: e => console.log('状态更改', e),
        jsonpCallback: e => console.log('jsonp for ie: ', e),
        onMsgNotify: _onMsgNotify,
        onGroupInfoChangeNotify: e => console.log('群资料变化', e),
        onGroupSystemNotifys: {
          // "1": onApplyJoinGroupRequestNotify, // 申请加群请求（只有管理员会收到）
          // "2": onApplyJoinGroupAcceptNotify, // 申请加群被同意（只有申请人能够收到）
          // "3": onApplyJoinGroupRefuseNotify, // 申请加群被拒绝（只有申请人能够收到）
          // "4": _onKickedGroupNotify, // 被管理员踢出群(只有被踢者接收到)
          '5': _onDestoryGroupNotify // 群被解散(全员接收)
          // "6": onCreateGroupNotify, // 创建群(创建者接收)
          // "7": onInvitedJoinGroupNotify, // 邀请加群(被邀请者接收)
          // "8": onQuitGroupNotify, // 主动退群(主动退出者接收)
          // "9": onSetedGroupAdminNotify, // 设置管理员(被设置者接收)
          // "10": onCanceledGroupAdminNotify, // 取消管理员(被取消者接收)
          // "11": onRevokeGroupNotify, // 群已被回收(全员接收)
          // "255": onCustomGroupNotify// 用户自定义通知(默认全员接收)
        },
        onFriendSystemNotifys: {
          // "1": onFriendAddNotify, //好友表增加
          // "2": onFriendDeleteNotify, //好友表删除
          // "3": onPendencyAddNotify, //未决增加
          // "4": onPendencyDeleteNotify, //未决删除
          // "5": onBlackListAddNotify, //黑名单增加
          // "6": onBlackListDeleteNotify//黑名单删除
        },
        onProfileSystemNotifys: e => console.log('资料更改', e),
        onKickedEventCall: e => console.log('被踢', e),
        onC2cEventNotifys: e => console.log('C2C: ', e)
      },
      {
        isLogOn: false
      },
      resp => {
        resolve(resp);
      },
      error => {
        resolve(error);
      }
    );
  });
}

export const im = {
  login: _login,
  logout: webim.logout,

  addMessageListener: listener => {
    if (_.every(msgListeners, it => it !== listener)) {
      msgListeners.push(listener);
    }
  },

  removeMessageListener: listener => {
    const index = _.findIndex(msgListeners, it => it === listener);
    if (-1 !== index) {
      msgListeners.splice(index, 1);
    }
  },

  addSysListener: listener => {
    if (_.every(systemMsgListeners, it => it !== listener)) {
      systemMsgListeners.push(listener);
    }
  },

  removeSysListener: listener => {
    const index = _.findIndex(systemMsgListeners, it => it === listener);
    if (-1 !== index) {
      systemMsgListeners.splice(index, 1);
    }
  },

  loadSessionMsg: groupId => {
    // console.log(groupId)
    const sessMap = webim.MsgStore.sessMap();
    const selected = sessMap[`GROUP${groupId}`];
    // console.log(toJS(selected))
    return selected && selected._impl;
  }
};
