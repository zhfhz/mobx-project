import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import AssetStore from './stores/asset-store';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation';
import { Button, Row, Col, Form, Input, Modal } from 'antd';
import './asset.scss';

interface DemoProps extends FormComponentProps {
  myCount: number;
}
@inject('asset', 'route')
@observer
class CreateForm extends Component<DemoProps> {
  getCheckCodeHandle = () => {
    const { MobileNumber } = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const { getCheckCode } = AssetStore;
    getCheckCode(MobileNumber, '2');
  };
  getValue = name => {
    return this.props.form.getFieldValue(name);
  };
  withdrawMoney = async e => {
    e.preventDefault();
    // 校验表单
    AssetStore.checkMoney();
    AssetStore.checkID();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        this.withdraw();
      }
    });
  };
  withdraw = async () => {
    const { withdrawMoney, Money, ID } = AssetStore;
    const obj = {
      UserType: '2',
      RefNo: '',
      VerificationCode: this.getValue('CheckCode').trim(),
      RealName: this.getValue('RealName').trim(),
      ID: ID.trim(),
      Money: Money,
      CardId: this.getValue('CardId').trim()
    };
    const IsSucceed = await withdrawMoney(obj);
    if (IsSucceed) {
      this.props.route.push('/account/asset');
    }
  };
  render () {
    const { myCount, form } = this.props;
    const { getFieldDecorator } = form;
    const { moneyError, RealName, ID, IDError, moneyChange, IDChange, CardID, showWithDraw } = AssetStore;
    return (
      <Form className="withdraw">
        <Form.Item style={{ width: 430, whiteSpace: 'nowrap' }} help={moneyError} validateStatus={moneyError ? 'error' : undefined}>
          <Input prefix={<label>提现金额</label>} placeholder="请输入大于1元的整数提现金额" onChange={moneyChange} />
          <span style={{ color: '#4dbecd', cursor: 'pointer' }} onClick={showWithDraw}>
            使用已有账号
          </span>
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('RealName', {
            initialValue: RealName,
            rules: [{ required: true, message: '姓名不能为空' }]
          })(<Input autoComplete="off" prefix={<label>姓名</label>} placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }} help={IDError} validateStatus={IDError ? 'error' : undefined}>
          <Input autoComplete="off" prefix={<label>身份证号码</label>} placeholder="请输入身份证号码" value={ID} onChange={IDChange} />
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('CardId', {
            initialValue: CardID,
            rules: [{ required: true, message: '支付宝账号不能为空' }]
          })(<Input autoComplete="off" prefix={<label>支付宝账号</label>} placeholder="请输入支付宝账号" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          <Row>
            <Col span={14}>
              {getFieldDecorator('CheckCode', {
                rules: [{ required: true, message: '验证码不能为空' }, { pattern: /^[0-9]{4}$/, message: '请输入手机验证码' }]
              })(<Input autoComplete="off" prefix={<label>验证账号</label>} placeholder="请输入验证码" />)}
            </Col>
            <Col span={10}>
              <Button type="primary" onClick={this.getCheckCodeHandle} disabled={myCount}>
                {myCount ? `${myCount} s后重新获取` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item style={{ width: 500 }}>
          <div className="tip_container">
            <p>温馨提示：</p>
            <p>
              提现仅支持支付宝账号，用户申请提现后的<span>1-2个工作日</span>安排款项，请耐心等待。
            </p>
          </div>
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          <Button type="primary" htmlType="submit" className="withdraw" onClick={this.withdrawMoney}>
            提现
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const CreateFormWrapper = Form.create()(CreateForm);

@inject('asset')
@observer
class WithDraw extends Component {
  componentDidMount () {
    const { getWithDrawList } = this.props.asset;
    getWithDrawList(1);
  }
  componentWillUnmount () {
    const s = this.props.asset;
    s.dispose();
  }
  render () {
    const { Count, WithDrawShow, closeWithDraw } = this.props.asset;
    return (
      <div className="asset-page">
        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['账户管理', '我的资产']} />
        </div>
        <div style={{ padding: 12, backgroundColor: '#FFF', minHeight: 'calc(100% - 160px)' }}>
          <CreateFormWrapper myCount={Count} />
        </div>
        <Modal visible={WithDrawShow} onCancel={closeWithDraw} title="提示" footer={null} width="600px">
          <div className="body-mesage">
            <p>您是首次填写提现申请，还没有账户资料，请根据下方表格填写，系统将记录您提现的资料</p>
            <p style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={closeWithDraw}>
                我知道了
              </Button>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}
export default WithDraw;
