import { observable, action } from 'mobx';
import { message } from 'antd';
import Area from '../../../assets/json/area.json';
import { http } from '../../../services/http';
import * as OSS from 'ali-oss';
import * as uuidv1 from 'uuid/v1';

export class CheckInfoStore {
  @observable MobileNumber = '';
  @observable Contacter = sessionStorage['Contacter'] || '';
  @observable CompanyName = sessionStorage['CompanyName'];
  @observable MainCategoryID = sessionStorage['MainCategoryID'];
  @observable MainCategoryName = sessionStorage['MainCategoryName'];
  @observable CompanyAddress = sessionStorage['CompanyAddress'] || '';
  @observable CompanyArea = sessionStorage['CompanyArea'] || '';
  @observable AppointmentTime = sessionStorage['AppointmentTime'] || '';
  @observable CompanyLicenseImg = sessionStorage['CompanyLicenseImg'];
  @observable CompanyState = '0';
  @observable province = '省';
  @observable provinceError = '';
  @observable city = '市';
  @observable area = '区';
  @observable Profile = '';
  @observable FactoryImgs = [];
  @observable factoryImgsError = '';
  @observable loading = false;
  @observable showModal = false;
  @observable modalList = [];
  @observable selectItem;
  @observable detailList = [];
  @observable selectList = [];
  @observable selectListError = '';
  @observable selectedText = '';
  @observable activeIndex = 0;
  @observable deleteList = [];
  @observable commitSucceed = false;
  @observable firstCategoryOption = [];
  @observable MainCategoryID = sessionStorage.getItem('MainCategoryID') || '';
  @observable provinces = Area.map(it => ({
    value: it.state,
    display: it.state
  }));
  @observable cities = Area.reduce(
    (acc, cur) => ({
      [cur.state]: cur.cities.map(it => ({ value: it.city, display: it.city })),
      ...acc
    }),
    {}
  );
  @observable info = Area.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.state]: cur.cities.reduce(
        (accInner, curInner) => ({
          ...accInner,
          [curInner.city]: curInner.areas.map(it => ({ value: it.county, display: it.county }))
        }),
        {}
      )
    }),
    {}
  );
  @observable areas = Object.keys(this.info).reduce(
    (acc, cur) => ({
      ...acc,
      ...this.info[cur]
    }),
    {}
  );
  @action checkSelectListError = () => {
    if (this.selectList.length !== 0) {
      this.selectListError = '';
    } else {
      this.selectListError = '请选择品类';
    }
  };
  @action checkProvince = () => {
    if (this.province !== '省') {
      this.provinceError = '';
    } else {
      this.provinceError = '请选择所在地区';
    }
  };
  @action checkFactoryImgs = () => {
    if (this.FactoryImgs.length) {
      this.factoryImgsError = '';
    } else {
      this.factoryImgsError = '请上传工厂图片';
    }
  };
  @action showModalHandle = () => {
    this.showModal = true;
  };
  @action hideModalHandle = () => {
    this.showModal = false;
    this.selectList = [];
    this.selectedText = '';
  };
  @action onChange = () => {
    this.loading = true;
  };
  @action aliOSS = async file => {
    const bucket = 'img-emake-cn';
    const region = 'oss-cn-shanghai';
    const accessKeyId = 'LTAIjK54yB5rocuv';
    const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';

    const client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    });
    let fileName = '';
    let fileTypeName = '';
    if (file) {
      const bool = file.size / 1024 / 1024 < 1;
      fileName = file.name;
      const arr = fileName.split('.');
      fileTypeName = arr[1];
      if (!bool) {
        message.error('请上传小于1M的图片!');
        return;
      }
    }

    const result = await client.put(uuidv1() + '.' + fileTypeName, file);
    if (result.res.status === 200 && result.res.statusCode === 200) {
      this.FactoryImgs.push(result.url);
      this.checkFactoryImgs();
      message.success('上传成功！');
    } else {
      message.error('上传失败');
    }
  };
  @action delImg = index => {
    this.FactoryImgs.splice(index, 1);
  };
  @action getCatagories = async () => {
    this.selectList = [];
    this.selectedText = '';
    const { Ok, ResultInfo, Data } = await http.get('/web/category_b?CategoryAId=' + this.MainCategoryID);
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.modalList = Data.ResultList;
  };
  @action selectCategory = item => {
    if (this.checkActive(item)) {
      this.selectList = this.selectList.filter(it => {
        return it.CategoryId !== item.CategoryId;
      });
    } else {
      this.selectList.push({
        CategoryId: item.CategoryId,
        CategoryName: item.CategoryName
      });
    }
  };
  @action checkActive = detailItem => {
    const arr = this.selectList.filter(it => {
      return it.CategoryId === detailItem.CategoryId && it.CategoryName === detailItem.CategoryName;
    });
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  @action delSelected = item => {
    this.selectList = this.selectList.filter(filterItem => {
      return filterItem['CategoryId'] !== item.CategoryId;
    });
  };
  @action cancel = () => {
    this.showModal = false;
  };
  @action submit = () => {
    if (!this.selectList.length) {
      message.error('请选择品类');
      return;
    }
    this.selectedText = '';
    // for(const item of this.selectList){
    //   this.selectedText += item['CategoryName']+'、'
    // }
    this.selectList.map((it, index) => {
      this.selectedText += it['CategoryName'] + (index === this.selectList.length - 1 ? '' : '、');
    });
    this.showModal = false;
    this.selectListError = '';
  };
  @action changeProvince = value => {
    this.province = value;
    this.city = this.cities[this.province][0].value;
    this.area = this.areas[this.city][0].value;
  };
  @action changeCity = value => {
    this.city = value;
    this.area = this.areas[this.city][0].value;
  };
  @action changeArea = value => {
    this.area = value;
  };
  @action commit = async obj => {
    const { Ok, ResultInfo } = await http.post('/factory/user/audit/commit', obj);
    if (!Ok) {
      message.error(ResultInfo);
      return false;
    }
    return true;
    // authStore.updateCompanyState();
  };
}

export default new CheckInfoStore();
