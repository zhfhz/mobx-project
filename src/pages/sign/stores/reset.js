import { observable, action } from 'mobx';
import { http } from '../../../services/http';
import { message } from 'antd';

export class ResetStore {
  @observable resetSucceed = false;
  @observable Count = 0;
  @observable interval;

  @action getCheckCode = async (MobileNumber, VerificationType) => {
    const { Ok, ResultInfo } = await http.post('/factory/verificationcode', {
      MobileNumber: MobileNumber,
      VerificationType: VerificationType
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('验证码已发送，请查收短信。');
    this.Count = 60;
    this.interval = setInterval(() => {
      this.Count--;
      if (this.Count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };
  @action forgetPwd = async obj => {
    const { Ok, ResultInfo } = await http.post('/factory/forgetpassword', obj);
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('修改密码成功！');
    this.resetSucceed = true;
  };
}
export default new ResetStore();
