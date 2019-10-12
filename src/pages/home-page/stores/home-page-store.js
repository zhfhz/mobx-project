import { observable, action, toJS } from 'mobx';
import { http } from '../../../services/http';
import { message } from 'antd';
import _ from 'lodash';

export class HomePage {
  @observable loadingCategory = false;
  @observable categories = [];
  @observable selectedCategory = undefined;

  @observable loadingMessage = false;
  @observable messages = [];
  @observable selectedMessage = undefined;
  @observable messageTotal = 0;
  pageSize = 8;
  @observable currentPage = 1;
  @observable Ads = [];

  @action load = async () => {
    this.loadingCategory = true;
    const { Ok, Data, ResultInfo } = await http.get('/dfcommon/get/category');
    this.loadingCategory = false;
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.categories = Data;
    this.selectedCategory = Data[0];

    this.loadMessage();
    this.getAd();
  };

  @action onMessagePageChange = async page => {
    this.loadingMessage = true;
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/get/sysinfo', {
      UserType: 2,
      SearchContent: '',
      pageIndex: page,
      pageSize: this.pageSize
    });
    this.loadingMessage = false;
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.currentPage = page;
    this.messages = Data.ResultList;
    this.messageTotal = Data.ResultCount;
  };
  @action getAd = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/console/adcenter', {
      PageIndex: 1,
      PageSize: 10000
    });
    if (!Ok) {
      message.error(ResultInfo);
    }
    this.Ads = Data ? (Data.ResultList ? Data.ResultList.filter(it => it.ProductType === '1' && it.ADState === '1') : []) : [];
  };

  @action loadMessage = () => {
    this.onMessagePageChange(1);
  };

  @action updateSelected = value => {
    this.selectedCategory = _.find(this.categories, it => it.CategoryId === value);
  };

  @action updateSelectedMessage = message => {
    this.selectedMessage = toJS(message);
  };
}

export default new HomePage();
