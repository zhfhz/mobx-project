import moment from 'moment';
export const UserType = {
  get consumer () {
    return '1';
  },
  get designer () {
    return '2';
  },
  get server () {
    return '3';
  },
  get factory () {
    return '4';
  }
};

export const MsgType = {
  get text () {
    return 'Text';
  }, // 文本
  get image () {
    return 'Image';
  }, // 图片
  get goods () {
    return 'Goods';
  }, // 商品
  get design () {
    return 'Design';
  }, // 设计
  get voice () {
    return 'Voice';
  }, // 音频
  get file () {
    return 'File';
  }, // 文件
  get order () {
    return 'Order';
  }, // 订单
  get system () {
    return 'System';
  }, // 入群系统消息
  get tipJoin () {
    return 'GroupTip_Join';
  }, // 邀请提醒
  get tipQuit () {
    return 'GroupTip_Quit';
  } // 成员退出提醒
};

/**
 * enum MsgType
 */
export function peekMsg (type, content) {
  switch (type) {
  case MsgType.text:
    return content;
  case MsgType.file:
    return '[文件]';
  case MsgType.goods:
    return '[商品]';
  case MsgType.design:
    return '[设计]';
  case MsgType.image:
    return '[图片]';
  case MsgType.order:
    return '[订单]';
  case MsgType.system:
    return '[系统消息]';
  case MsgType.tipQuit:
    return '[系统提示]';
  case MsgType.tipJoin:
    return '[系统提示]';
  default:
    return '[未知类型]';
  }
}

/**
 * 显示 至今时间间隔
 * @param {*} updateTime
 */
export function fromNow (updateTime) {
  const updateT = new Date(updateTime).getTime();
  const nowT = new Date().getTime();
  const durationT = (nowT - updateT) / 1000 / 60 / 60;
  const updateYear = new Date(updateTime).getFullYear();
  const nowYear = new Date().getFullYear();
  const updateMonth = new Date(updateTime).getMonth();
  const nowMonth = new Date().getMonth();
  const updateDate = new Date(updateTime).getDate();
  const nowDate = new Date().getDate();
  // console.log(updateYear, nowYear, updateMonth, nowMonth, updateDate, nowDate, updateTime, typeof updateTime)
  if (updateYear !== nowYear) {
    return updateTime && updateTime.substr(0, 10);
  } else {
    if (updateMonth !== nowMonth || updateDate !== nowDate) {
      if (durationT < 48) {
        // return '昨天 '
        return updateTime && updateTime.substr(0, 10);
      }
      return updateTime && updateTime.substr(5, 5);
    } else {
      const time = updateTime && updateTime.substr(11, 5);
      return time;
    }
  }
}

/**
 * 显示时间点
 * @param {*} idx
 * @param {*} history
 */
export function showTime (idx, history) {
  // let str = ''
  // if (i % 10 === 0 && new Date(m.MsgCreateTime).getTime() < new Date().getTime() - 300000) {
  //   str = m.MsgCreateTime
  // }
  // return str
  const msgs = history;
  // console.log(msgs[idx])
  // const ua = navigator.userAgent.toLowerCase()
  // let isIos = false
  // if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
  //   isIos = true
  // }
  if (!msgs[idx - 1]) {
    if (msgs[idx] && msgs[idx].MsgCreateTime) {
      // console.log(msgs[idx]);
      // if (isIos) {
      //   return msgs[idx].MsgCreateTime.replace(/-/g, '/')
      // } else {
      //   return moment(msgs[idx].MsgCreateTime).format('YYYY-MM-DD HH:mm')
      // }
      return moment(msgs[idx].MsgCreateTime).format('YYYY-MM-DD HH:mm');
    } else {
      // if (isIos) {
      //   return moment(new Date()).format('YYYY-MM-DD HH:mm').replace(/-/g, '/')
      // } else {
      //   return moment(new Date()).format('YYYY-MM-DD HH:mm')
      // }
      return moment(new Date()).format('YYYY-MM-DD HH:mm');
    }
  }
  // const t1 = moment((msgs[idx - 1].MsgCreateTime) * 1000);
  // const t2 = moment((msgs[idx].MsgCreateTime) * 1000);
  const t1 = new Date(msgs[idx - 1].MsgCreateTime.replace(/-/g, '/')).getTime();
  const t2 = new Date(msgs[idx].MsgCreateTime.replace(/-/g, '/')).getTime();
  const du = moment.duration(t2 - t1).minutes();
  if (du >= 5) {
    // if (isIos) {
    //   return msgs[idx].MsgCreateTime.replace(/-/g, '/')
    // }
    return moment(msgs[idx].MsgCreateTime).format('YYYY-MM-DD HH:mm');
  }
  return '';
}
