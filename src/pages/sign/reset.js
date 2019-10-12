import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input, Button, message, Row, Col, Icon } from 'antd';
import { observer, inject } from 'mobx-react';
import * as Md5 from 'md5';
import './reset.scss';
import * as _ from 'lodash';
import shenhezhong from '../../assets/img/shenhezhong.png';
import { RouteComponentProps } from 'react-router-dom';
import ResetStore from './stores/reset';

interface Props extends RouteComponentProps<{}> {}

interface DemoProps extends FormComponentProps {
  myCount: number;
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    }
  }
};
const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};
@observer
class CreateForm extends React.Component<DemoProps> {
  type = 'text';
  handleSubmit = e => {
    e.preventDefault();
    const { forgetPwd } = ResetStore;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const obj = JSON.stringify({
          MobileNumber: values.MobileNumber,
          VerificationCode: values.CheckCode,
          Password: Md5(`${values.Password}:emake`).toUpperCase()
        });
        forgetPwd(obj);
      }
    });
  };
  getCheckcodeHandle = () => {
    const { getCheckCode } = ResetStore;
    const mobileNumber = this.props.form.getFieldValue('MobileNumber');
    if (!mobileNumber || !/^1\d{10}$/.test(mobileNumber)) {
      message.error('请先输入11位手机号码！');
      return;
    }
    getCheckCode(mobileNumber, '2');
  };
  checkConfirm = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('Password')) {
      callback('2次密码输入不一致！!');
    } else {
      callback();
    }
  };
  validator = (name, pattern) => {
    return !!(this.props.form.getFieldValue(name) && !pattern.test(this.props.form.getFieldValue(name)));
  };

  emitEmpty = () => {
    this.props.form.setFieldsValue({ MobileNumber: '' });
  };
  emitEmptyPwd = () => {
    this.props.form.setFieldsValue({ Password: '' });
  };
  changeType = () => {
    this.type = 'password';
  };
  render () {
    const { myCount, form } = this.props;
    const { getFieldDecorator } = form;
    const validateStatus = undefined;
    return (
      <Form onSubmit={this.handleSubmit} className="forgetpwd">
        <Form.Item {...formItemLayout} style={{ width: 430 }} validateStatus={validateStatus} hasFeedback={true}>
          {getFieldDecorator('MobileNumber', {
            rules: [{ required: true, message: '手机号码不能为空' }, { pattern: /^1\d{10}$/, message: '手机号码格式错误' }]
          })(
            <Input
              prefix={<label>手机号码</label>}
              placeholder="请输入手机号码"
              autoComplete="off"
              suffix={this.validator('MobileNumber', /^1\d{10}$/) ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} style={{ width: 430 }}>
          <Row>
            <Col span={14}>
              {getFieldDecorator('CheckCode', {
                rules: [{ required: true, message: '验证码不能为空' }]
              })(<Input autoComplete="off" prefix={<label>手机验证码</label>} placeholder="请输入手机验证码" />)}
            </Col>
            <Col span={10}>
              <Button type="primary" disabled={myCount} onClick={this.getCheckcodeHandle}>
                {myCount ? `${myCount}s后重新获取` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...formItemLayout} style={{ width: 430 }}>
          {getFieldDecorator('Password', {
            rules: [{ required: true, message: '密码不能为空' }, { pattern: /^[a-zA-Z0-9]{6,18}$/, message: '请输入6-18位数字和字母组合密码(区分大小写)' }]
          })(
            <Input
              type={this.type}
              prefix={<label>新密码</label>}
              placeholder="请输入新密码"
              autoComplete="off"
              onFocus={this.changeType}
              suffix={this.validator('Password', /^[a-zA-Z0-9]{6,18}$/) ? <Icon type="close-circle" onClick={this.emitEmptyPwd} /> : null}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} style={{ width: 430 }}>
          {getFieldDecorator('ConfirmPassword', {
            rules: [{ required: true, message: '请再次输入新密码' }, { validator: this.checkConfirm }]
          })(<Input type={this.type} onFocus={this.changeType} autoComplete="off" prefix={<label>确认密码</label>} placeholder="请再次输入新密码" />)}
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
@inject(stores => _.pick(stores, ['reset']))
@observer
class Reset extends Component<Props> {
  componentDidMount () {
    const s = this.props.reset;
    s.resetSucceed = false;
    s.Count = 0;
    window.clearInterval(s.interval);
  }
  toLogin = () => {
    this.props.history.push('/sign/login');
  };
  render () {
    const { resetSucceed, Count } = this.props.reset;
    return (
      <div style={{ height: '100%', margin: '0 auto', paddingTop: 100, backgroundColor: '#fff' }}>
        {resetSucceed ? (
          <div style={{ color: '#333', textAlign: 'center' }}>
            <img src={shenhezhong} />
            <p style={{ marginTop: 30 }}>恭喜您：重置密码成功，请牢记新的登录密码！</p>
            <p>
              <Button type="default" style={{ color: '#4dbecd', borderColor: '#4dbecd' }} onClick={this.toLogin}>
                去登录
              </Button>
            </p>
          </div>
        ) : (
          <CreateFormWrapper myCount={Count} />
        )}
      </div>
    );
  }
}
export default Reset;
