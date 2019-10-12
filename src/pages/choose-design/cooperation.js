import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Navigation } from '../../components/navigation';
import { Info } from '../../components/show-info';
import { Table } from 'antd';
import './cooperation.scss';

@inject(stores => ({
  product: stores.product
}))
@observer
class Cooperation extends Component {
  render () {
    const { columns, data } = this.props.product;
    // const { params } = this.props.match
    return (
      <div style={{ padding: '0 10' }}>
        {/* 上个页面传过来的id号：{ params.id } */}
        <div className="chooseDesign">
          <Navigation tags={['选择设计', '选择合作']} />
        </div>
        <div className="chooseDesign">
          <div>
            <p className="detailsinfo">商品参数</p>
            <Info
              label="容量"
              img={[
                'https://live-static.segmentfault.com/308/357/3083572615-59cb9959b3f87_render',
                'https://live-static.segmentfault.com/308/357/3083572615-59cb9959b3f87_render',
                'https://live-static.segmentfault.com/308/357/3083572615-59cb9959b3f87_render'
              ]}
            />
            <Info label="阻抗" txt="4%" />
            <Info label="商品品类" txt="6%" />
            <Info label="品牌名称" txt="8%" />
          </div>
          <div>
            <p className="detailsinfo">商品价格</p>
            <Table columns={columns} dataSource={data} size="small" />
          </div>
        </div>
      </div>
    );
  }
}

export default Cooperation;
