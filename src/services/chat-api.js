import { http } from './http';
import { im } from './im';

/**
 * 从服务器拉取之前所有的聊天记录
 */
export function getLastChatRecord () {
  return http.get('/app/chat/msg/list');
}

/**
 * 连接聊天服务器
 */
export async function connectChatServer () {
  return await im.login();
}

/**
 * 清除消息未读状态
 * @param {string} id 消息ID
 */
export async function clearUnreadInfo (id) {
  return await http.post('app/msg/read', {
    MsgId: id
  });
}

/**
 * 从服务器拉取指定会话的聊天记录
 * @param {object} param0
 * pageIndex: 起始索引
 * pageSize: 每页显示条数
 * ChatTargetType: 0为单聊，1为群聊
 * ChatTargetId: 聊天会话标识ID，群聊单聊都有唯一标识
 */
export async function getChatRecordById ({ PageIndex, PageSize, ChatTargetType, ChatTargetId }) {
  return await http.get('/app/chat/msg/recode', {
    RequestType: '1',
    PageIndex,
    PageSize,
    ChatTargetStyle: '0',
    ChatTargetType: ChatTargetType,
    ChatTargetId: ChatTargetId
  });
}

/**
 * 邀请客服加入群组
 * @param {string} id 群组标识
 */
export async function askCustomerToTheGroup (id) {
  return await http.post('/app/invite/customer', {
    GroupId: id
  });
}

/**
 * 发送聊天消息
 * @param {object} data 发送方的数据包含在data中
 */
export async function sendDataRequest (data) {
  return await http.post('/app/user/send/jmsg', data);
}

/**
 * 获取【设计】列表
 * @param {object} param0
 * SearchContent: 筛选关键字
 * RequestType:
 * DesignUserId: 设计师ID
 */
export function getDesignListData ({ SearchContent, RequestType, DesignUserId }) {
  return http.get('/dfcommon/designmanagenew', {
    SearchContent,
    pageIndex: 1,
    pageSize: 10000,
    RequestType,
    DesignUserId
  });
}

/**
 * 预售（众测）商品列表
 * @param {object} param0
 * SearchContent:
 * CategoryId1:
 * PresellState:
 * DesignUserId:
 */
export async function getAdvanceSaleGoodsListData ({ SearchContent, CategoryId1, PresellState, DesignUserId, DesignState, GoodsKind }) {
  return await http.get('/dfcommon/designmanage', {
    SearchContent,
    pageIndex: 1,
    pageSize: 10000,
    CategoryId1,
    PresellState,
    IsDesign: '1',
    GoodsKind,
    UserType: '2',
    DesignState,
    // CompanyID: this.CompanyID,
    DesignUserId
  });
}

/**
 * 获取订单列表
 * @param {object} param0
 * OrderState:
 * SearchContent:
 * DesignUserId:
 */
export function getOrderListData ({ OrderState, SearchContent, DesignUserId }) {
  return http.get('/dfcommon/order', {
    UserType: '2',
    OrderType: '1',
    pageIndex: 1,
    pageSize: 10000,
    OrderState,
    SearchContent,
    DesignUserId
  });
}

/**
 * 获取类目
 */
export async function getCatelog () {
  return await http.get('/dfcommon/get/category');
}

/**
 * 关闭聊天
 * @param {*} groupId 对话ID
 * @param {*} targetStyle 对方身份类型
 */
export async function closeChat (groupId, targetStyle) {
  return await http.post('/app/chat/close', {
    GroupId: groupId,
    MemStyle: targetStyle
  });
}
