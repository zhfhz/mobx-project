/* eslint-disable no-console */
import { observable, action, computed } from 'mobx';
import { http } from '../../../services/http';
import { message } from 'antd';
import appStore from '../../app/stores/app';

export class Presell {
  @observable keyword = '';
  @observable curStatLabel = '众测中';
  @observable PresellState = '0';
  @observable MainCategoryID = sessionStorage.getItem('MainCategoryID');
  @observable CompanyID = appStore.CompanyID || '';
  @observable paging = {
    current: 1,
    total: 0,
    size: '10',
    hideOnSinglePage: true,
    onChange: page => {
      this.paging.current = page;
      this.getData();
    }
  };
  @observable tableData = [];
  tip1 = '温馨提示：众测商品正在都市智造APP火热众测中';
  tip2 = '温馨提示：众测商品成功后可由设计师手动转入常规商品销售';
  tip3 = '温馨提示：众测失败商品且无用户下单，可由设计师编辑后重新发布众测，如已有用户下单，无法编辑';
  @observable renderTip = this.tip1;

  @computed get tableDataDisplay () {
    return this.tableData.map((it, index) => ({ ...it, key: index }));
  }

  @action keywordChange = val => {
    this.keyword = val;
    if (this.keyword.trim() === '') {
      this.paging.current = 1;
      this.getData();
    }
  };

  @action changeStat = label => () => {
    this.curStatLabel = label;
    this.paging.current = 1;
    switch (this.curStatLabel) {
    case '众测中':
      this.PresellState = '0';
      this.renderTip = this.tip1;
      break;
    case '众测成功':
      this.PresellState = '1';
      this.renderTip = this.tip2;
      break;
    case '众测失败':
      this.PresellState = '-1';
      this.renderTip = this.tip3;
      break;
    }
    this.getData();
  };
  @action getData = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/dfcommon/designmanage', {
      SearchContent: this.keyword,
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      CategoryId1: this.MainCategoryID,
      PresellState: this.PresellState,
      IsDesign: '1',
      GoodsKind: '1',
      UserType: '2',
      CompanyID: this.CompanyID
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.tableData = Data.ResultList;
    this.paging.total = Data.ResultCount;
  };

  @action search = () => {
    this.getData();
  };
  @action dispose = () => {
    this.keyword = '';
    this.curStatLabel = '众测中';
    this.PresellState = '0';
    this.paging.current = 1;
  };
}

export default new Presell();
