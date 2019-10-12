import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation';
import { Icon, Button, Row, Col, Table, Modal, Form, Input } from 'antd';
import './asset.scss';
import { Switch } from '../../components/switch';
import { FormComponentProps } from 'antd/lib/form';
import AssetStore from './stores/asset-store';
import Empty from '../../components/empty/index';
import img from '../../assets/img/empty.png';
const CashStateMap = {
  '0': '申请中',
  '1': '审核中',
  '2': '提现成功',
  '3': '提现失败'
};
const cols = [
  {
    title: '时间',
    dataIndex: 'EditWhen',
    align: 'center'
  },
  {
    title: '提现',
    dataIndex: 'Money',
    align: 'center'
  },
  {
    title: '状态',
    align: 'center',
    render: row => {
      return CashStateMap[row.CashState];
    }
  }
];
const profitCols = [
  {
    title: '时间',
    dataIndex: 'InDate',
    align: 'center'
  },
  {
    title: '订单编号',
    dataIndex: 'OrderNo',
    align: 'center'
  },
  {
    title: '设计师店铺',
    dataIndex: 'StoreName',
    align: 'center'
  },
  {
    title: '工厂分成比例',
    align: 'center',
    render (row) {
      return row.CompanyRate * 100 + '%';
    }
  },
  {
    title: '收益金额',
    dataIndex: 'CompanyInMoney',
    align: 'center'
  }
];
interface DemoProps extends FormComponentProps {
  myCount: number;
  history: History;
}

@observer
class CreateForm extends React.Component<DemoProps> {
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
    AssetStore.checkMoney();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.withdraw();
      }
    });
  };
  withdraw = async () => {
    const { withdrawMoney } = AssetStore;
    const obj = {
      UserType: '2',
      RefNo: '',
      VerificationCode: this.getValue('CheckCode'),
      RealName: this.getValue('RealName'),
      ID: this.getValue('ID'),
      Money: this.getValue('Money'),
      CardId: this.getValue('CardId')
    };
    await withdrawMoney(obj);
  };
  render () {
    const { myCount, form } = this.props;
    const { getFieldDecorator } = form;
    const { moneyError, moneyChange } = AssetStore;
    return (
      <Form className="withdraw">
        <Form.Item style={{ width: 430 }} help={moneyError} validateStatus={moneyError ? 'error' : undefined}>
          <Input prefix={<label>提现金额</label>} placeholder="请输入大于1元的提现金额" onChange={moneyChange} />
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('RealName', {
            rules: [{ required: true, message: '姓名不能为空' }]
          })(<Input autoComplete="off" prefix={<label>姓名</label>} placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('ID', {
            rules: [{ required: true, message: '身份证号码不能为空' }]
          })(<Input autoComplete="off" prefix={<label>身份证号码</label>} placeholder="请输入身份证号码" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          {getFieldDecorator('CardId', {
            rules: [{ required: true, message: '支付宝账号不能为空' }]
          })(<Input autoComplete="off" prefix={<label>支付宝账号</label>} placeholder="请输入支付宝账号" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }} extra={myCount ? '验证码已发送，120s内输入有效' : ''}>
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

@inject('asset', 'route')
@observer
class Asset extends Component {
  componentDidMount () {
    const { getData } = this.props.asset;
    getData();
  }
  toWithDraw = () => {
    this.props.route.push('/account/asset/withdraw');
  };
  render () {
    const {
      curStatLabel,
      changeStat,
      withDrawDisplay,
      paging,
      profitDisplay,
      WithDrawShow,
      closeWithDraw,
      Count,
      TodayIn,
      KeepMoney,
      YesterdayIn,
      AllIn,
      OutMoney,
      monthIn,
      weekIn
    } = this.props.asset;
    return (
      <div className="asset_page">
        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['账户管理', '我的资产']} />
        </div>
        <div style={{ padding: 12, backgroundColor: '#FFF', minHeight: 'calc(100% - 160px)' }}>
          <div className="info_container">
            <span>
              <Icon type="info-circle" />
              温馨提示：用户确认收货后，系统按照设计师和工厂设定的分成比例自动将收益转入设计师和工厂账户
            </span>
          </div>
          <div className="total_info">
            <div className="balance">
              <p>余额（元）</p>
              <p className="money total">
                <span className="total">￥</span>
                {KeepMoney}
                {
                  <Button type="primary" style={{ float: 'right' }} onClick={this.toWithDraw}>
                    提现
                  </Button>
                }
              </p>
            </div>
            <Row>
              <Col span={4}>
                <p>总收益（元）</p>
                <p className="money">
                  <span>￥</span>
                  {AllIn}
                </p>
              </Col>
              <Col span={4}>
                <p>今日收益（元）</p>
                <p className="money">
                  <span>￥</span>
                  {TodayIn}
                </p>
              </Col>
              <Col span={4}>
                <p>昨日收益（元）</p>
                <p className="money">
                  <span>￥</span>
                  {YesterdayIn}
                </p>
              </Col>
              <Col span={4}>
                <p>7天收益（元）</p>
                <p className="money">
                  <span>￥</span>
                  {weekIn}
                </p>
              </Col>
              <Col span={4}>
                <p>30天收益（元）</p>
                <p className="money">
                  <span>￥</span>
                  {monthIn}
                </p>
              </Col>
              <Col span={4}>
                <p>已提现（元）</p>
                <p className="money">
                  <span>￥</span>
                  {OutMoney}
                </p>
              </Col>
            </Row>
          </div>
          <Switch tabs={[{ label: '提现记录', click: changeStat('提现记录') }, { label: '收益记录', click: changeStat('收益记录') }]} cur={curStatLabel} />
          {curStatLabel === '提现记录' ? (
            withDrawDisplay.length ? (
              <Table columns={cols} pagination={{ ...paging }} dataSource={withDrawDisplay} />
            ) : (
              <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
            )
          ) : profitDisplay.length ? (
            <Table columns={profitCols} pagination={{ ...paging }} dataSource={profitDisplay} />
          ) : (
            <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
          )}
        </div>

        <Modal visible={WithDrawShow} onCancel={closeWithDraw} title="提现" footer={null} width="600px">
          <CreateFormWrapper myCount={Count} />
        </Modal>
      </div>
    );
  }
}

export default Asset;
