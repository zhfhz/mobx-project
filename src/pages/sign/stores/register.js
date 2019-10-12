import { observable, action } from 'mobx';
import { message } from 'antd';
import { http } from '../../../services/http';
import appStore from '../../app/stores/app';
import * as OSS from 'ali-oss';
import * as uuidv1 from 'uuid/v1';

export class RegisterStore {
  @observable RuleModalShow = false;
  @observable Count = 0;
  @observable agreementContent = '';
  @observable ImageUrl = '';
  @observable loading = false;
  @observable firstCategoryOption = [];
  @observable CompanyLicenseImgError = '';
  @observable CompanyName = '';
  @observable CompanyNameError = '';

  @action getAgreement = async () => {
    const { Ok, Data, ResultInfo } = await http.get('/factory/getprotocol');
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    this.agreementContent = Data.Content;
    // s = ''
    let str = this.agreementContent;
    // console.log('===============', str);
    // eslint-disable-next-line no-useless-escape
    str = str.replace(/&gg/g, '"'); // 替换半角单引号为全角单引号
    str = str.replace(/&tt/g, "'");
    // str = str.replace(/&nbsp;/g, '  ');
    // str=str.replace(/\"/g,"”");// 替换半角双引号为全角双引号
    str = str.replace(/&lg/g, '<').replace(/&tg/g, '>');
    //
    // jQuery("#content").html(str);
    this.agreementContent = str;
  };
  @action getCheckCode = async (MobileNumber, VerificationType) => {
    const { ResultInfo, Ok } = await http.post('/factory/verificationcode', {
      MobileNumber: MobileNumber,
      VerificationType: VerificationType
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('验证码已发送，请查收短信。');
    this.Count = 60;
    const interval = setInterval(() => {
      this.Count--;
      if (this.Count === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  @action getFirstCategory = async () => {
    const { Ok, ResultInfo, Data } = await http.get('/web/category_a');
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    if (Data) {
      this.firstCategoryOption = Data.ResultList && Data.ResultList.filter(it => it.OnSale === '1');
    }
  };
  @action showModal = () => {
    this.RuleModalShow = true;
  };
  @action hideModal = () => {
    this.RuleModalShow = false;
  };
  @action onChange = () => {
    this.loading = true;
  };
  @action companyNameChange = e => {
    this.CompanyName = e.target.value;
    if (this.CompanyName === '') {
      this.CompanyNameError = '公司名称不能为空';
    } else {
      this.CompanyNameError = '';
    }
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
      const bool = file.size / 1024 / 1024 < 2;
      fileName = file.name;
      const arr = fileName.split('.');
      fileTypeName = arr[1];
      if (!bool) {
        message.error('请上传小于2M的图片!');
        return;
      }
    }

    const result = await client.put(uuidv1() + '.' + fileTypeName, file);
    if (result.res.status === 200 && result.res.statusCode === 200) {
      this.ImageUrl = result.url;
      this.CompanyLicenseImgError = '';
      message.success('上传成功！');
    } else {
      message.error('上传失败');
    }
  };
  @action deleteImg = () => {
    this.ImageUrl = '';
    this.CompanyLicenseImgError = '请上传营业执照';
  };
  @action register = async obj => {
    const { Ok, Data, ResultInfo } = await http.post('/factory/user/regist', obj);
    if (!Ok) {
      if (ResultInfo && ResultInfo.indexOf('公司名称') !== -1) {
        this.CompanyNameError = '当前公司已注册，请勿重复注册';
      } else {
        message.error(ResultInfo);
      }
      this.registerSucceed = false;
      return false;
    } else {
      const { access_token, refresh_token } = Data;
      appStore.updateToken(access_token, refresh_token);
      appStore.updateMainCategoryID(obj.MainCategoryID);
      return true;
    }
  };
  @action reRegister = async obj => {
    const { Ok, ResultInfo } = await http.post('/factory/user/regist/resubmit', obj);
    if (!Ok) {
      message.error(ResultInfo);
      this.registerSucceed = false;
      return false;
    } else {
      message.success(ResultInfo);
      return true;
    }
  };
}
export default new RegisterStore();
