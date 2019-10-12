/* eslint-disable no-console */
import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { http } from '../../../services/http';

export class PreOrderStore {
  @observable keyword = '';
  @observable tableData = [];
  @observable GoodsSeriesCode = '';
  @observable PresellState = '';
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

  @action search = () => {
    this.getData();
  };
  @action getData = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/dfcommon/order', {
      SearchContent: this.keyword,
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      OrderType: '0',
      UserType: '2',
      GoodsSeriesCode: this.GoodsSeriesCode,
      GoodsKind: this.PresellState ? '1' : '0'
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.tableData = Data.ResultList;
    this.paging.total = Data.ResultCount;
  };

  @action dispose = () => {
    this.keyword = '';
    this.PresellState = '0';
    this.paging.current = 1;
  };
}

export default new PreOrderStore();
