import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input, Button, Icon, Select, message, Upload, Modal, Tag, Row, Col } from 'antd';
import CheckInfoStore from './stores/check-info';
import './check-info.scss';
const Option = Select.Option;

interface DemoProps extends FormComponentProps {
  history: History;
}

@observer
class CreateForm extends React.Component<DemoProps> {
  provinceChange = v => {
    const { changeProvince } = CheckInfoStore;
    changeProvince(v);
    if (CheckInfoStore.provinceError) {
      CheckInfoStore.provinceError = '';
    }
  };
  cityChange = v => {
    const { changeCity } = CheckInfoStore;
    changeCity(v);
  };
  areaChange = v => {
    const { changeArea } = CheckInfoStore;
    changeArea(v);
  };
  validateCategory = async (rule, value, callback) => {
    const { selectList } = CheckInfoStore;
    if (!selectList.length) {
      callback('请选择品类');
    } else {
      callback();
    }
  };
  validatePrivince = (rule, value, callback) => {
    const { province } = CheckInfoStore;
    if (province === '省') {
      callback('请选择所在地区');
    } else {
      callback();
    }
  };
  validateFactoryImgs = (rule, value, callback) => {
    const { FactoryImgs } = CheckInfoStore;
    if (!FactoryImgs.length) {
      callback('请上传工厂图片');
    } else {
      callback();
    }
  };
  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片大小必须在1M以内！');
    }
    return isLt2M;
  };
  handleChange = async () => {
    const { onChange } = CheckInfoStore;
    onChange();
  };
  customRequest = ({ file }) => {
    const { aliOSS } = CheckInfoStore;
    aliOSS(file);
  };
  delImg = idx => {
    const { delImg, checkFactoryImgs } = CheckInfoStore;
    delImg(idx);
    checkFactoryImgs();
  };
  getValue = name => {
    return this.props.form.getFieldValue(name);
  };
  handleSubmit = e => {
    e.preventDefault();

    CheckInfoStore.checkSelectListError();
    CheckInfoStore.checkProvince();
    CheckInfoStore.checkFactoryImgs();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { selectListError, provinceError, factoryImgsError } = CheckInfoStore;
        if (selectListError || provinceError || factoryImgsError) {
          return;
        }
        const { selectList, province, city, area, FactoryImgs } = CheckInfoStore;
        const arr = [];
        selectList.forEach(item => {
          arr.push(item.CategoryId);
        });
        if (!err) {
          const data = {
            Contacter: this.props.form.getFieldValue('Contacter'),
            CompanyArea: province + '-' + city + '-' + area, // 省市区
            CompanyAddress: this.props.form.getFieldValue('detailAddress'),
            CategoryList: arr,
            CompanyDesc: this.props.form.getFieldValue('Profile'),
            AppointmentTime: this.props.form.getFieldValue('AppointmentTime'),
            CompanyViewList: FactoryImgs
          };
          // console.log(data)
          this.certificate(data);
        }
      }
    });
  };
  certificate = async obj => {
    const { commit } = CheckInfoStore;
    const IsSucceed = await commit(obj);
    if (IsSucceed) {
      this.props.history.push('/sign/waitaudit');
    }
  };
  render () {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { provinces, cities, areas, province, city, area, showModalHandle, selectedText, CompanyState, loading, FactoryImgs, factoryImgsError, selectListError, provinceError } = CheckInfoStore;
    const provinceDisplay = provinces.map((item, index) => (
      <Option key={index} value={item.value}>
        {item.display}
      </Option>
    ));
    const cityDisplay =
      province !== '省'
        ? cities[province].map((item, index) => (
          <Option key={index} value={item.value}>
            {item.display}
          </Option>
        ))
        : [];
    // const areaDisplay:object[] = [];
    const areaDisplay =
      city !== '市'
        ? areas[city].map((item, index) => (
          <Option key={index} value={item.value}>
            {item.display}
          </Option>
        ))
        : [];
    return (
      <Form onSubmit={this.handleSubmit} className="companyinfo">
        <Form.Item>
          {getFieldDecorator('Contacter', {
            rules: [{ required: true, message: '联系人不能为空' }]
          })(<Input prefix={<label>联系人</label>} maxLength={6} placeholder="请输入联系人姓名，6个字以内" />)}
        </Form.Item>
        <Form.Item help={selectListError} validateStatus={selectListError ? 'error' : undefined}>
          {
            <div className="category_container">
              <label>品类</label>
              <Button className="category" onClick={showModalHandle}>
                {selectedText}
                <Icon type="right" />
              </Button>
            </div>
          }
        </Form.Item>
        <Form.Item help={provinceError} validateStatus={provinceError ? 'error' : undefined}>
          {
            <div className="address">
              <Select value={province} style={{ width: 116, marginRight: 16 }} onChange={this.provinceChange}>
                {provinceDisplay}
              </Select>
              <Select value={city} style={{ width: 116, marginRight: 16 }} onChange={this.cityChange}>
                {cityDisplay}
              </Select>
              <Select value={area} style={{ width: 116 }} onChange={this.areaChange}>
                {areaDisplay}
              </Select>
            </div>
          }
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('detailAddress', {
            rules: [{ required: true, message: '请输入详细地址' }]
          })(<Input prefix={<label>详细地址</label>} maxLength={30} placeholder="请输入详细地址，30个字以内" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('Profile', {
            rules: [{ required: true, message: '请输入工厂简介' }]
          })(
            <div style={{ position: 'relative' }}>
              <label>工厂简介</label>
              <br />
              <Input.TextArea className="textarea" placeholder="请输入工厂简介" rows={5} maxLength={100} />
              <span style={{ position: 'absolute', right: 40, bottom: -4, fontSize: '12px', color: '#BFBFBF' }}>
                {this.getValue('Profile') ? this.getValue('Profile').length : 0}/{'100'}
              </span>
            </div>
          )}
        </Form.Item>
        <Form.Item help={factoryImgsError} validateStatus={factoryImgsError ? 'error' : undefined}>
          {
            <div className="factoryImgs_container">
              <label>工厂图片</label>
              <br />
              <div className="upload_container">
                <Upload
                  action={'//git.emake.cn:4000/image'}
                  name="avatar"
                  className="avatar-uploader"
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                  disabled={FactoryImgs.length === 10}
                  loading={loading}
                  customRequest={this.customRequest}
                >
                  <Button>选择图片({FactoryImgs.length + '/' + '10'})</Button>
                </Upload>
                请上传工厂图片，大小限制在<span className="blue">1M以内</span>，图片格式支持<span className="blue">JPG、PNG</span>等
              </div>
              <div className="img_container">
                {FactoryImgs.map((it, index) => (
                  <div key={index} className="show_container">
                    <img src={it} style={{ margin: (index + 1) % 5 === 0 ? '0 0 7.5px 0' : '0 7.5px 7.5px 0' }} />
                    <Icon type="close-circle" onClick={this.delImg.bind(this, index)} />
                  </div>
                ))}
              </div>
            </div>
          }
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('AppointmentTime', {
            rules: [{ required: true, message: '请选择验厂时间' }]
          })(<Input prefix={<label>预约验厂</label>} type="date" placeholder="请选择验厂时间" />)}
        </Form.Item>
        <Form.Item style={{ width: 430 }}>
          <Button type="primary" htmlType="submit" className="certificate" disabled={CompanyState === '1'}>
            {CompanyState === '1' ? '验厂中' : '提交'}
          </Button>
        </Form.Item>
        <Form.Item>
          <div className="tip_container">
            <p>温馨提示：</p>
            <p>1.申请验厂之后，在15个工作日内都市智造-超级线上工厂工作人员与您联系进行产能和相关资质审核。</p>
            <p>
              2.
              <a style={{ textDecoration: 'underline' }} href="http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/EMAKE_Inspection_Content.pdf" target="_blank" rel="noopener noreferrer">
                验厂需准备材料下载.pdf
              </a>
            </p>
          </div>
        </Form.Item>
      </Form>
    );
  }
}
const CreateFormWrapper = Form.create()(CreateForm);

@inject('checkinfo')
@observer
class CheckInfo extends Component {
  componentDidMount () {
    const { getCatagories } = this.props.checkinfo;
    getCatagories();
  }
  selectCate = item => {
    const { selectCategory } = this.props.checkinfo;
    selectCategory(item);
  };
  deleteSelected = item => {
    const { delSelected } = this.props.checkinfo;
    delSelected(item);
  };
  render () {
    const { showModal, hideModalHandle, selectList, modalList, checkActive, submit } = this.props.checkinfo;
    const selectedDisplay = selectList.map(item => (
      <Tag key={item.CategoryId} className="cell" closable={true} afterClose={() => this.deleteSelected(item)}>
        {item.CategoryName}
      </Tag>
    ));
    const modalDisplay = modalList.map(item => (
      <Button key={item.CategoryId} className={'cell ' + (checkActive(item) ? 'selected' : '')} onClick={() => this.selectCate(item)}>
        {item.CategoryName}
      </Button>
    ));
    return (
      <div className="check-info-page">
        <div style={{ width: 400, margin: '0px auto', paddingTop: 30 }}>
          <CreateFormWrapper history={this.props.history} />
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
              <Button type="primary" onClick={submit}>
                确认
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

export default CheckInfo;
