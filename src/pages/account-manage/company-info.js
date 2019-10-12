import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Input, Button, Icon, Select, Tag, Modal, Row, Col } from 'antd';
import CompanyInfoStore from './stores/company-info-store';
import './company-info.scss';
import { Navigation } from '../../components/navigation';

@observer
class CreateForm extends React.Component {
  render () {
    const { CompanyLicenseImg, province, city, area, MobileNumber, Contacter, CompanyName, MainCategoryName, CompanyAddress, showModalHandle, selectedText, profile, CompanyImgs } = CompanyInfoStore;

    return (
      <Form className="companyinfo">
        <Form.Item>
          <Input disabled={true} prefix={<label>手机号码</label>} placeholder="请输入手机号码" value={MobileNumber} />
        </Form.Item>
        <Form.Item>
          <Input disabled={true} prefix={<label>联系人</label>} placeholder="请输入联系人" value={Contacter} />
        </Form.Item>
        <Form.Item>
          <Input disabled={true} prefix={<label>公司名称</label>} placeholder="请输入公司名称" value={CompanyName} />
        </Form.Item>
        <Form.Item>
          <Input disabled={true} prefix={<label>所属行业</label>} value={MainCategoryName} />
        </Form.Item>
        <Form.Item>
          <div className="category_container">
            <label>品类</label>
            <Button className="category" onClick={showModalHandle}>
              {selectedText}
              <Icon type="down" />
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <div className="address">
            <Select disabled={true} className="province" value={province} style={{ width: 116, marginRight: 16 }} />
            <Select disabled={true} className="city" value={city} style={{ width: 116, marginRight: 16 }} />
            <Select disabled={true} className="area" value={area} style={{ width: 116 }} />
          </div>
        </Form.Item>
        <Form.Item>
          <Input disabled={true} prefix={<label>详细地址</label>} placeholder="请输入详细地址" value={CompanyAddress} />
        </Form.Item>
        <Form.Item>
          <p>工厂简介：</p>
          <Input.TextArea className="textarea" disabled={true} value={profile} rows={5} placeholder="工厂简介" />
        </Form.Item>
        <Form.Item>
          <p>营业执照：</p>
          <a href={CompanyLicenseImg} target="_blank" rel="noopener noreferrer">
            <img src={CompanyLicenseImg} />
          </a>
        </Form.Item>
        <Form.Item>
          <p>工厂照片：</p>
          <div className="img_container">
            {CompanyImgs.map((it, index) => (
              <a key={index} href={it} target="_blank" rel="noopener noreferrer">
                <img src={it} style={{ margin: (index + 1) % 3 === 0 ? '0 0 10px 0' : '0 10px 10px 0' }} />
              </a>
            ))}
          </div>
        </Form.Item>
      </Form>
    );
  }
}
const CreateFormWrapper = Form.create()(CreateForm);

@inject('companyInfo')
@observer
class CompanyInfo extends Component {
  componentDidMount () {
    const { getCatagories, getUserInfo } = this.props.companyInfo;
    getUserInfo();
    getCatagories();
  }
  render () {
    const { showModal, hideModalHandle, selectList, modalList, checkActive } = this.props.companyInfo;
    const selectedDisplay = selectList.map((item, index) => (
      <Tag key={index} className="cell" closable={false}>
        {item.CategoryName}
      </Tag>
    ));
    const modalDisplay = modalList.map((item, index) => (
      <Button key={index} title={item.CategoryName} className={'cell ' + (checkActive(item) ? 'selected' : '')}>
        {item.CategoryName}
      </Button>
    ));
    return (
      <div className="company-info-page">
        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['账户管理', '公司信息']} />
        </div>
        {/* <Navigation tags={['公司信息']} /> */}
        <div style={{ padding: 12, backgroundColor: '#FFF' }}>
          <div className="info_container">
            <span>
              <Icon type="info-circle" />
              温馨提示：验厂成功后，信息均不能修改，如需修改请联系官方客服
            </span>
          </div>
          <div style={{ width: 400, margin: '20px auto' }}>
            <CreateFormWrapper />
          </div>
        </div>
        <Modal
          visible={showModal}
          width={600}
          className="selectCategory"
          title={'查看经营品类'}
          onCancel={hideModalHandle}
          footer={
            <div className="footer">
              <Button type="default" onClick={hideModalHandle}>
                取消
              </Button>
            </div>
          }
        >
          <Row className="selectedList">{selectedDisplay}</Row>
          <Row className="modalList">{modalDisplay}</Row>
        </Modal>
      </div>
    );
  }
}

export default CompanyInfo;
