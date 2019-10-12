import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { getDesignListData, getAdvanceSaleGoodsListData, getCatelog, getOrderListData } from '@/services/chat-api';
import appStore from '../../app/stores/app';

/**
 * 处理会话相关信息
 */
export class ChatAboutStore {
  @observable curStatLabel = '选择设计';
  @observable DesignList = [];
  @observable PreGoodsList = [];
  @observable GoodsList = [];
  @observable OrderList = [];
  @observable MainCategoryID = appStore.MainCategoryID;
  @observable firstCateList = [];
  @observable firstCate = {};
  @observable secCateList = [];
  @observable secCate = {};
  @observable CategoryId1 = appStore.MainCategoryID;
  @observable keyword = '';
  @observable OrderState = '';
  @observable PreState = '';
  @observable RequestType = '205';
  // @observable CompanyID = appStore.CompanyID;

  @action init = async () => {
    this.curStatLabel = '选择设计';
    this.DesignList = [];
    this.PreGoodsList = [];
    this.GoodsList = [];
    this.OrderList = [];
    this.MainCategoryID = appStore.MainCategoryID;
    this.firstCateList = [];
    this.firstCate = {};
    this.secCateList = [];
    this.secCate = {};
    this.CategoryId1 = appStore.MainCategoryID;
    this.keyword = '';
    this.OrderState = '';
    this.PreState = '';
    this.RequestType = '205';
    this.getDesignManage();
  };
  @action update = async () => {};

  @computed get targetUserId () {
    return this.app.chatList.current.ChatTarget.UserId;
  }
  @computed get current () {
    return this.app.chatList.current;
  }
  @action changeStat = label => () => {
    // 切换Tab
    this.dispose();
    this.curStatLabel = label;
    switch (label) {
    case '选择设计':
      this.RequestType = '205';
      this.getDesignManage();
      break;
    case '众测商品':
      this.PreState = '';
      this.getPreList();
      break;
    case '常规商品':
      this.getCateList();
      break;
    case '生产订单':
      this.OrderState = '';
      this.getProductOrder();
      break;
    }
  };
  @action changeChooseStat = e => {
    // 选择设计下的tab切换
    // this.DesignState = e.target.value || ''
    this.RequestType = e.target.value || '';
    console.log(e);
    this.getDesignManage();
  };
  @action changePreStat = e => {
    this.PreState = e.target.value || '';
    this.getPreList();
  };
  @action changeOrderStat = e => {
    this.OrderState = e.target.value || '';
    this.getProductOrder();
  };
  @action keywordChange = e => {
    this.keyword = e.target.value || '';
    switch (this.curStatLabel) {
    case '选择设计':
      this.getDesignManage();
      break;
    case '众测商品':
      this.getPreList();
      break;
    case '常规商品':
      this.getCateList();
      break;
    case '生产订单':
      this.getProductOrder();
      break;
    }
  };
  @action getDesignManage = async () => {
    // 设计列表
    // const { Data, Ok, ResultInfo } = await http.get('/dfcommon/designmanage', {
    //   SearchContent: this.keyword,
    //   IsDesign: 0,
    //   UserType: 2,
    //   DesignState: this.DesignState,
    //   pageIndex: 1,
    //   pageSize: 10000,
    //   CategoryId1: this.CategoryId1,
    //   // CompanyID: this.CompanyID,
    //   DesignUserId: this.targetUserId
    // })
    // if (!Ok) {
    //   message.error(ResultInfo)
    //   return
    // }
    // this.DesignList = Data.ResultList

    const { Data, Ok, ResultInfo } = await getDesignListData({
      SearchContent: this.keyword,
      RequestType: this.RequestType,
      DesignUserId: this.targetUserId
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.DesignList = Data.ResultList;
  };
  @action getPreList = async () => {
    const { Ok, ResultInfo, Data } = await getAdvanceSaleGoodsListData({
      SearchContent: this.keyword,
      CategoryId1: this.CategoryId1,
      PresellState: this.PreState,
      DesignState: '101',
      GoodsKind: '1',
      // CompanyID: this.CompanyID,
      DesignUserId: this.targetUserId
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.PreGoodsList = Data.ResultList;
  };

  @action getCateList = async () => {
    const { Ok, ResultInfo, Data } = await getCatelog();
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    if (Data) {
      const list = Data.find(it => it.CategoryId === this.MainCategoryID);
      if (list) {
        this.firstCateList = list.ChList ? list.ChList : [];
      }
      this.firstCate = this.firstCateList.length ? this.firstCateList[0] : {};
      if (this.firstCate.CategoryId) {
        this.secCateList = this.firstCate.ChList ? this.firstCate.ChList : [];
        this.secCate = this.secCateList.length ? this.secCateList[0] : {};
      }
      this.getGoodsList();
    }
  };
  @action changeFirstCate = item => () => {
    this.firstCate = item;
    this.secCateList = this.firstCate.ChList ? this.firstCate.ChList : [];
    this.secCate = this.secCateList.length ? this.secCateList[0] : {};
    this.getGoodsList();
  };
  @action changeSecCate = item => () => {
    this.secCate = item;
    this.getGoodsList();
  };

  @action getGoodsList = async () => {
    const { Ok, ResultInfo, Data } = await getAdvanceSaleGoodsListData({
      SearchContent: this.keyword,
      CategoryId1: this.MainCategoryID,
      CategoryId2: this.firstCate.CategoryId ? this.firstCate.CategoryId : '',
      CategoryId3: this.secCate.CategoryId ? this.secCate.CategoryId : '',
      GoodsKind: '0',
      DesignState: '101',
      GoodsState: '1',
      // CompanyID: this.CompanyID,
      DesignUserId: this.targetUserId
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.GoodsList = Data.ResultList;
  };
  @action getProductOrder = async () => {
    // 生产订单列表
    const { Data, Ok, ResultInfo } = await getOrderListData({
      OrderState: this.OrderState,
      SearchContent: this.keyword,
      DesignUserId: this.targetUserId
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.OrderList = Data.ResultList;
  };

  @action dispose = () => {
    this.keyword = '';
  };
}
export default new ChatAboutStore();
