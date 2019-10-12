import React, { Component } from 'react';
import { Form, Input, Button, message, Icon, Row, Col, Select, Upload, Checkbox, Modal } from 'antd';
import './register.scss';
import { FormComponentProps } from 'antd/lib/form';
import { observer, inject } from 'mobx-react';
import yingyezhizhao from '../../assets/img/yingyezhizao.png';
import RegisterStore from './stores/register';
import * as Md5 from 'md5';

const Option = Select.Option;

interface DemoProps extends FormComponentProps {
  myCount: number;
  history: History;
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    }
  }
};

@observer
class CreateForm extends React.Component<DemoProps> {
  type = 'text';
  customRequest = ({ file }) => {
    const { aliOSS } = RegisterStore;
    aliOSS(file);
  };
  getValue = name => {
    return this.props.form.getFieldValue(name);
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (RegisterStore.ImageUrl === '') {
      RegisterStore.CompanyLicenseImgError = '请上传营业执照';
    }
    if (RegisterStore.CompanyName === '') {
      RegisterStore.CompanyNameError = '公司名称不能为空';
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { CompanyLicenseImgError, CompanyNameError } = RegisterStore;
        if (CompanyLicenseImgError || CompanyNameError) {
          return;
        }
        this.register();
      }
    });
  };
  register = async () => {
    const { ImageUrl, register, CompanyName } = RegisterStore;
    const obj = {
      MobileNumber: this.getValue('MobileNumber'),
      VerificationCode: this.getValue('CheckCode'),
      Password: Md5(`${this.getValue('Password')}:emake`).toUpperCase(),
      CompanyName: CompanyName,
      MainCategoryID: this.getValue('Industry'),
      CompanyLicenseImg: ImageUrl
    };
    const IsSucceed = await register(obj);
    if (IsSucceed) {
      this.props.history.push('/sign/certificate');
    }
  };
  getCheckCodeHandle = () => {
    const mobileNumber = this.props.form.getFieldValue('MobileNumber');
    if (!mobileNumber || !/^1\d{10}$/.test(mobileNumber)) {
      message.error('请先输入11位手机号码！');
      return;
    }
    const { getCheckCode } = RegisterStore;
    getCheckCode(mobileNumber, '1');
  };

  validator = (name, pattern) => {
    return !!(this.props.form.getFieldValue(name) && !pattern.test(this.props.form.getFieldValue(name)));
  };
  validateChecked = (rule, value, callback) => {
    if (!value) {
      callback('请先阅读并同意《入驻都市智造超级线上工厂框架协议》');
    } else {
      callback();
    }
  };

  emitEmpty = () => {
    this.props.form.setFieldsValue({ MobileNumber: '' });
  };
  emitEmptyPwd = () => {
    this.props.form.setFieldsValue({ Password: '' });
  };
  deleteAvatar = () => {
    const { deleteImg } = RegisterStore;
    deleteImg();
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片大小必须在1M以内！');
    }
    return isLt2M;
  };
  handleChange = async () => {
    const { onChange } = RegisterStore;
    onChange();
  };
  changeType = () => {
    this.type = 'password';
  };

  render () {
    const { myCount, form } = this.props;
    const { getFieldDecorator } = form;
    const UserState = sessionStorage['UserState'];
    const { ImageUrl, showModal, loading, firstCategoryOption, CompanyLicenseImgError, CompanyNameError, companyNameChange } = RegisterStore;
    const validateStatus = undefined;
    const deleteButton = (
      <div className="delete-container" onClick={this.deleteAvatar}>
        <Icon className="delete-icon" type="close-circle" />
      </div>
    );
    const firstCategoryDispay = firstCategoryOption.map(it => {
      return (
        <Option key={it.CategoryId} value={it.CategoryId}>
          {it.CategoryName}
        </Option>
      );
    });
    // const url=app.baseUrl;
    return (
      <Form className="register" onSubmit={this.handleSubmit}>
        {UserState !== '-1' ? (
          <div>
            <Form.Item style={{ width: 430, display: UserState === '-1' ? 'none' : 'inline-block' }} validateStatus={validateStatus} hasFeedback={true}>
              {getFieldDecorator('MobileNumber', {
                rules: [{ required: true, message: '手机号码输入不正确' }, { pattern: /^1\d{10}$/, message: '手机号码输入不正确' }]
              })(
                <Input
                  prefix={<label>中国+86</label>}
                  suffix={this.validator('MobileNumber', /^1\d{10}$/) ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null}
                  placeholder="请输入手机号码"
                />
              )}
            </Form.Item>
            <Form.Item style={{ width: 430, display: UserState === '-1' ? 'none' : 'inline-block' }}>
              <Row>
                <Col span={14} style={{ width: 240 }}>
                  {getFieldDecorator('CheckCode', {
                    rules: [{ required: true, message: '验证码输入不正确' }, { pattern: /^[0-9]{4}$/, message: '验证码输入不正确' }]
                  })(<Input autoComplete="off" prefix={<label>手机验证码</label>} placeholder="请输入手机验证码" />)}
                </Col>
                <Col span={10}>
                  <Button type="primary" onClick={this.getCheckCodeHandle} disabled={myCount}>
                    {myCount ? `${myCount} s后重新获取` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item style={{ width: 430, display: UserState === '-1' ? 'none' : 'inline-block' }} validateStatus={validateStatus} hasFeedback={true}>
              {getFieldDecorator('Password', {
                rules: [{ required: true, message: '请输入6-18位的密码' }, { pattern: /^[a-zA-Z0-9]{6,18}$/, message: '请输入6-18位的密码' }]
              })(
                <Input
                  type={this.type}
                  prefix={<label>设置密码</label>}
                  placeholder="请输入密码"
                  onFocus={this.changeType}
                  suffix={this.validator('Password', /^[a-zA-Z0-9]{6,11}$/) ? <Icon type="close-circle" onClick={this.emitEmptyPwd} /> : null}
                />
              )}
            </Form.Item>
          </div>
        ) : null}
        <Form.Item style={{ width: 430 }} help={CompanyNameError} validateStatus={CompanyNameError ? 'error' : undefined}>
          <Input autoComplete="off" prefix={<label>公司名称</label>} maxLength={20} placeholder="请输入公司名称，20个字以内" onChange={companyNameChange} />
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          <div className="industry">
            <label>行业</label>
            {getFieldDecorator('Industry', {
              rules: [{ required: true, message: '请选择所属行业' }]
            })(<Select placeholder="请选择公司行业">{firstCategoryDispay}</Select>)}
          </div>
        </Form.Item>
        <Form.Item style={{ width: 430 }} help={CompanyLicenseImgError} validateStatus={CompanyLicenseImgError ? 'error' : undefined}>
          <div>
            <Upload
              action={'//git.emake.cn:4000/image'}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              accept="image/*"
              showUploadList={false}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
              loading={loading}
              customRequest={this.customRequest}
            >
              <img src={ImageUrl ? ImageUrl : yingyezhizhao} />
            </Upload>
            {ImageUrl ? deleteButton : null}
          </div>
        </Form.Item>
        <Form.Item style={{ width: 720, marginBottom: 0 }}>
          <p style={{ marginBottom: 0 }}>请上传营业执照图片，大小限制在1M以内，图片格式支持JPG、PNG等</p>
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('CheckBox', {
            valuePropName: 'checked',
            initialValue: true,
            rules: [{ required: true, message: '请先阅读并同意《入驻都市智造超级线上工厂框架协议》' }, { validator: this.validateChecked }]
          })(<Checkbox />)}
          我已认真阅读并同意
          <span className="agreementTip" style={{ color: '#FF9900' }} onClick={showModal}>
            《入驻都市智造超级线上工厂框架协议》
          </span>
        </Form.Item>
        <Form.Item {...tailFormItemLayout} style={{ width: 430 }}>
          <Button type="primary" htmlType="submit" className="register">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const CreateFormWrapper = Form.create()(CreateForm);
@inject('register')
@observer
class Register extends Component {
  componentDidMount () {
    const { getFirstCategory, getAgreement } = this.props.register;
    getFirstCategory();
    getAgreement();
    this.props.register.ImageUrl = '';
  }
  render () {
    const { RuleModalShow, hideModal, Count, agreementContent } = this.props.register;
    return (
      <div className="register-page">
        <div style={{ width: 430, margin: '0 auto', paddingTop: 100, marginBottom: 100 }}>
          <CreateFormWrapper myCount={Count} history={this.props.history} />
        </div>
        <Modal
          className="agreement"
          visible={RuleModalShow}
          title="《入驻都市智造超级线上工厂框架协议》"
          onCancel={hideModal}
          width={717}
          bodyStyle={{
            maxHeight: 350,
            overflowY: 'scroll'
          }}
          footer={
            <Button type="primary" onClick={hideModal}>
              我已阅读
            </Button>
          }
        >
          <div dangerouslySetInnerHTML={{ __html: agreementContent }} />
        </Modal>
      </div>
    );
  }
}
export default Register;
