import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Input, Button, Icon } from 'antd';
import _ from 'lodash';
import phoneLogo from '../../assets/img/phone.png';
import passwordLogo from '../../assets/img/mima.png';
import checkCodeLogo from '../../assets/img/验证码.png';
import logo_dark from '../../assets/img/logo_dark.png';
import { Link } from 'react-router-dom';
import './login.scss';

const iconStyle = {
  color: 'rgba(0, 0, 0, .25)',
  width: '20px',
  height: '20px',
  transform: 'translateX(-4px)'
};

@inject(stores => _.pick(stores, ['login']))
@observer
class Login extends Component {
  componentDidMount () {
    const { getPicCode } = this.props.login;
    getPicCode();
  }
  login = async () => {
    const { login } = this.props.login;
    const companyState = await login();
    switch (companyState) {
    case '0':
      this.props.history.push('/sign/certificate');
      break;
    case '1':
      this.props.history.push('/sign/waitaudit');
      break;
    case '-2':
      this.props.history.push('/sign/auditfailed');
      break;
    }
  };
  render () {
    const { loading, phoneInput, passwordInput, codeUrl, picCodeInput, getPicCode, errorMsg } = this.props.login;
    return (
      <div className="login-page">
        <div className="logo_container">
          <img src={logo_dark} style={{ marginBottom: '22px' }} /> 都市智造-超级线上工厂
        </div>
        <div className="welcome">
          <p>“欢迎使用</p>
          <p style={{ textIndent: 15 }}>都市智造-超级线上工厂”</p>
        </div>
        <p className="copyRight">
          <Icon type="copyright" />
          Emake Tech Co.Ltd All Rights Reserved @1.1.6 苏ICP备18051566号-1
        </p>
        <div className="form-container">
          <h1>登录</h1>
          <Form onSubmit={this.login} className="login-form">
            <Form.Item>
              <Input prefix={<img src={phoneLogo} alt="" style={iconStyle} />} onChange={phoneInput} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item>
              <Input prefix={<img src={passwordLogo} alt="" style={iconStyle} />} type="password" onChange={passwordInput} placeholder="请输入登录密码" />
            </Form.Item>
            <Form.Item>
              <div className="picCode_container">
                <Input prefix={<img src={checkCodeLogo} alt="" style={iconStyle} />} type="text" onChange={picCodeInput} placeholder="请输入验证码" />
                <img src={codeUrl} alt="图形验证码" onClick={getPicCode} />
              </div>
            </Form.Item>
            {errorMsg ? (
              <p style={{ color: 'red', backgroundColor: '#FCD3D3', lineHeight: '28px', height: '28px', padding: '0 10px', fontSize: '12px' }}>
                <Icon type="exclamation-circle" style={{ marginRight: 5 }} />
                {errorMsg}
              </p>
            ) : null}
            <Form.Item>
              <Button type="primary" onClick={this.login} className="login-form-button" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="form-bottom">
            <span>
              <Link to="/sign/register">立即注册</Link>
            </span>
            <span>
              <Link to="/sign/reset">忘记密码</Link>
            </span>
          </div>
        </div>
        {/* {demo}
        <Button
          type='primary'
          loading={loading}
          onClick={login}
        >Login</Button> */}
      </div>
    );
  }
}

export default Login;
