/* eslint-disable no-console */
import { observable, action, toJS } from 'mobx';
import { http } from '../../../services/http';
import { message } from 'antd';

export class Detail {
  @observable GoodsSeriesCode = '';
  @observable MainCategoryID = sessionStorage.getItem('MainCategoryID');
  @observable Data = {};
  @observable GoodsKind = '0';
  @observable GoodsSurfaceImg = [];
  @observable GoodsSeriesQuality = [];
  @observable priceList = [];

  @action getData = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/dfcommon/designmanage', {
      pageIndex: 1,
      pageSize: 10000,
      CategoryId1: this.MainCategoryID,
      UserType: '2',
      GoodsSeriesCode: this.GoodsSeriesCode
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    const data = Data.ResultList.length ? Data.ResultList[0] : {};
    if (typeof data.GoodsSeriesPhotos === 'string' && data.GoodsSeriesPhotos !== '') {
      data.GoodsSeriesPhotos = JSON.parse(data.GoodsSeriesPhotos);
    }
    this.Data = data;
    this.GoodsKind = this.Data ? this.Data.GoodsKind : '0';
    this.priceList = this.Data ? this.Data.Products : [];
    this.GoodsSurfaceImg = [];
    this.GoodsSeriesQuality = this.Data ? this.Data.GoodsSeriesQuality.split('|') : [];
    if (this.GoodsKind === '0' && this.Data && this.Data.GoodsPhoto) {
      this.GoodsSurfaceImg.push(this.Data.GoodsPhoto);
    } else if (this.GoodsKind === '1' && this.Data && this.Data.GoodsSurfaceImg) {
      this.GoodsSurfaceImg.push(this.Data.GoodsSurfaceImg);
    }
  };
}

export default new Detail();
