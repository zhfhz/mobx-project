import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation';
import { Info } from '../../components/show-info';
import './detail.scss';
import { Button } from 'antd';

@inject(stores => ({
  product: stores.product
}))
@observer
class Details extends Component {
  componentDidMount () {
    const { params } = this.props.match;
    const GoodsSeriesCode = params.id;
    const { getDesignDetails } = this.props.product;
    getDesignDetails(GoodsSeriesCode);
  }

  downLoad = () => {
    const { fileListDisplay } = this.props.product;
    for (var i = 0; i < fileListDisplay.length; i++) {
      const urlArr = [];
      urlArr.push(fileListDisplay[i].Url);
      window.open.apply(window, urlArr);
    }
  };

  goBack = () => {
    const { getDesignManage } = this.props.product;
    getDesignManage();
    this.props.history.push('/design/choose');
  };

  render () {
    const {
      CategoryName1,
      CategoryName2,
      CategoryName3,
      BrandName,
      brandViewDisplay,
      BrandCulture,
      GoodsSeriesName,
      viewListDisplay,
      descriptionDisplay,
      DesignDesc,
      fileListDisplay,
      DesignRate
    } = this.props.product;
    const category = CategoryName2 + '-' + CategoryName3;
    return (
      <div className="details" style={{ padding: '0 10' }}>
        <div className="chooseDesign">
          <Navigation tags={['选择设计', '设计详情']} />
        </div>
        <div className="chooseDesign">
          <div>
            <p className="detailsinfo">基本信息 </p>
            <Info label="行业" txt={CategoryName1} />
            <Info label="品类" txt={category} />
            <Info label="品牌名称" txt={BrandName} />
            <Info label="品牌图片" img={brandViewDisplay} />
            <Info label="品牌内涵" txt={BrandCulture} />
          </div>
        </div>
        <div className="chooseDesign">
          <div>
            <p className="detailsinfo">产品设计</p>
            <Info label="产品设计名称" txt={GoodsSeriesName} />
            <Info label="产品设计展示图" img={viewListDisplay} description={descriptionDisplay} />
            <Info label="设计说明" txt={DesignDesc} />
            <label style={{ align: 'left', fontSize: '12px', margin: '16px 0', lineHeight: '18px', whiteSpace: 'nowrap' }}>设计文件：</label>
            {fileListDisplay.map((m, i) => (
              <a href="#" onClick={this.downLoad} key={i} style={{ display: 'inline-block', maxWidth: '80%', verticalAlign: 'top', whiteSpace: 'normal' }}>
                {m.Name}
              </a>
            ))}
          </div>
        </div>
        <div className="chooseDesign">
          <div>
            <p className="detailsinfo">商务说明</p>
            <Info label="设计师分成比例" txt={(DesignRate * 100).toFixed(0) + '%'} />
          </div>
          <div style={{ padding: '30px 0', textAlign: 'center' }}>
            <Button style={{ color: '#fff', backgroundColor: '#33CCCC', width: '90px', borderRadius: '0', border: '0' }} onClick={() => this.goBack()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default Details;
