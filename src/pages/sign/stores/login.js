import { observable, action } from 'mobx';
// import appStore from '.././../app/stores/app'
import { http } from '../../../services/http';
import * as md5 from 'md5';
import appStore from '../../app/stores/app';
import { message } from 'antd';

export class Login {
  @observable loading = false;
  @observable phoneNumber = '';
  @observable password = '';
  @observable picCode = '';
  @observable codeUrl = '';
  @observable rowID = '';
  @observable showError = false;
  @observable errorMsg = '';

  @action phoneInput = e => {
    const v = e.target.value;
    if (v === '') {
      this.phoneNumber = '';
      return;
    }
    const num = parseInt(v, 10);
    if (!isNaN(num)) {
      this.phoneNumber = num + '';
    }
  };

  @action passwordInput = e => {
    this.password = e.target.value || '';
  };

  @action picCodeInput = e => {
    this.picCode = e.target.value || '';
  };

  @action getPicCode = async () => {
    const { Ok, Data } = await http.get('/dfcommon/piccode');
    if (Ok) {
      this.codeUrl = 'data:image/jpeg;base64,' + Data.PicB64;
      this.rowID = Data.RowID;
    }
  };

  @action login = async () => {
    // this.loading = true
    if (!this.phoneNumber || !/^1\d{10}$/.test(this.phoneNumber)) {
      this.errorMsg = '请输入11位手机号码';
      return;
    }
    if (!this.password || !/^[a-zA-Z0-9]{6,18}$/.test(this.password)) {
      this.errorMsg = '请输入6-18位登录密码';
      return;
    }
    if (!this.picCode) {
      this.errorMsg = '请输入图形验证码';
      return;
    }
    this.loading = true;
    const { Ok, ResultInfo, Data } = await http.post('/factory/user/login', {
      MobileNumber: this.phoneNumber,
      Password: md5(this.password + ':emake')
        .toString()
        .toUpperCase(),
      RowID: this.rowID,
      Content: this.picCode
    });
    if (!Ok) {
      this.loading = false;
      this.errorMsg = ResultInfo;
      return;
    }
    this.loading = false;
    appStore.updateToken(Data.access_token, Data.refresh_token);
    appStore.updateMainCategoryID(Data.UserInfo.MainCategoryID);
    if (Data.UserInfo.CompanyState === '2') {
      appStore.login(Data.UserInfo);
    } else {
      if (Data.UserInfo.CompanyState === '-2') {
        sessionStorage.setItem('AuditReason', Data.UserInfo.AuditReason ? Data.UserInfo.AuditReason : '');
      }
      switch (Data.UserInfo.CompanyState) {
      case '0':
        return '0';
      case '1':
        return '1';
      case '-2':
        return '-2';
      }
    }
  };
}

export default new Login();
