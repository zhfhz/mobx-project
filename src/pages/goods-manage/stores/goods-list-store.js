/* eslint-disable no-console */
import { observable, action, computed, toJS } from 'mobx';
import { message } from 'antd';
import { http } from '../../../services/http';
import appStore from '../../app/stores/app';

export class GoodsList {
  @observable keyword = '';
  @observable curStatLabel = '已上架';
  @observable GoodsState = '1';
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
  @observable curFirstCate = {
    CategoryId: '',
    CategoryName: '全部'
  };
  @observable firstCateList = []; // 一级分类列表
  @observable curSecCate = {
    CategoryId: '',
    CategoryName: '全部'
  };
  @observable secCateList = []; // 二级分类列表
  @observable allCateList = []; // 一级二级列表
  @observable curSeries = {};
  @observable showStoreEdit = false; // 编辑库存模态框
  @observable storeNumber = 1;

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
    case '已上架':
      this.GoodsState = '1';
      break;
    case '已下架':
      this.GoodsState = '0';
      break;
    }
    this.getData();
  };
  @action switchFirstCate = (label, val) => {
    this.curFirstCate = {
      CategoryId: val,
      CategoryName: label
    };
    this.getData();
    this.getSecList();
  };
  @action switchSecCate = (label, val) => {
    this.curSecCate = {
      CategoryId: val,
      CategoryName: label
    };
    this.getData();
  };
  @action closeModal = () => {
    this.curSerisCode = '';
    this.showStoreEdit = false;
  };
  @action storeChange = value => {
    this.storeNumber = value;
  };
  @action editStoreNumber = async () => {
    if (this.storeNumber < 1 || !Number.isInteger(this.storeNumber)) {
      message.error('商品库存请输入大于1的整数');
      return;
    }
    const { Ok, ResultInfo } = await http.put('/factory/set/yunnum', {
      GoodsSeriesCode: this.curSeries.GoodsSeriesCode,
      YunNum: this.storeNumber
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('编辑库存操作成功！');
    this.showStoreEdit = false;
    this.getData();
  };
  @action getData = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/dfcommon/designmanage', {
      SearchContent: this.keyword,
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      CategoryId1: this.MainCategoryID,
      CategoryId2: this.curFirstCate.CategoryId,
      CategoryId3: this.curSecCate.CategoryId,
      GoodsState: this.GoodsState,
      IsDesign: '1',
      GoodsKind: '0',
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
  @action getCatagories = async () => {
    // this.selectList = []
    // this.selectedText = ''
    const { Ok, ResultInfo, Data } = await http.get('/factory/user/operatecategory');
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    if (Data.ResultList.length) {
      this.firstCateList = Data.ResultList.filter(it => {
        return it.Selected === '1';
      });
      this.firstCateList.unshift({
        CategoryId: '',
        CategoryName: '全部'
      });
      this.getSecCateList();
    }
  };
  @action getSecList = () => {
    this.secCateList = [];
    if (this.curFirstCate.CategoryId === '') {
      this.firstCateList.map(it => {
        this.allCateList.map(item => {
          if (it.CategoryId === item.CategoryId) {
            item.ChList.map(oItem => {
              this.secCateList.push(oItem);
            });
          }
        });
      });
    } else {
      console.log(toJS(this.firstCateList));
      console.log(toJS(this.allCateList));
      this.allCateList.map(it => {
        if (it.CategoryId === this.curFirstCate.CategoryId) {
          it.ChList.map(item => {
            this.secCateList.push(item);
          });
        }
      });
    }
    this.secCateList.unshift({
      CategoryId: '',
      CategoryName: '全部'
    });
    this.curSecCate = {
      CategoryId: '',
      CategoryName: '全部'
    };
  };
  @action getSecCateList = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/dfcommon/get/category');
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    console.log(Data);
    if (Data) {
      const list = Data.filter(it => {
        return it.CategoryId === this.MainCategoryID;
      });
      this.allCateList = list.length > 0 ? list[0].ChList : [];
      this.firstCateList = this.allCateList ? this.allCateList.concat() : [];
      this.firstCateList.unshift({
        CategoryId: '',
        CategoryName: '全部'
      });
      console.log(toJS(this.allCateList));
      this.getSecList();
    }
  };

  @action dispose = () => {
    this.keyword = '';
    this.curStatLabel = '已上架';
    this.GoodsState = '1';
    this.paging.current = 1;
    this.curFirstCate = {
      CategoryId: '',
      CategoryName: '全部'
    };
    this.curSecCate = {
      CategoryId: '',
      CategoryName: '全部'
    };
  };
}

export default new GoodsList();
