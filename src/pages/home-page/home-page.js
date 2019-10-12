import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, Col, Row, Spin, Modal, Pagination, Tabs } from 'antd';
import './style.scss';
import ModernCard from '../../components/modern-card/index';
import banner from '../../assets/img/homePage.png';
import chooseDesign from '../../assets/img/pic1.png';
import presell from '../../assets/img/pic2.png';
import order from '../../assets/img/pic3.png';
import goodsImg from '../../assets/img/d_g.png';
import sysImg from '../../assets/img/d_s.png';
import img from '../../assets/img/empty.png';
import Empty from '../../components/empty/index';

// const RadioGroup = Radio.Group;
// const RadioButton = Radio.Button;
const TabPane = Tabs.TabPane;

/**
 * 绘制底部品类与系统消息面板
 */
function Panel ({ title, logo, children }) {
  return (
    <div className="panel">
      <div className="header">
        <img src={logo} style={{ width: 16, height: 16 }} />
        <span className="title">{title}</span>
      </div>
      <div className="body">{children}</div>
    </div>
  );
}

@inject('homePage', 'route')
@observer
class HomePage extends Component {
  componentDidMount () {
    this.props.homePage.load();
  }

  _renderCategory () {
    // 绘制可选择的品类
    const { loadingCategory, categories, selectedCategory: selected, updateSelected } = this.props.homePage;
    return (
      <Spin spinning={loadingCategory}>
        {categories.length ? (
          <div className="category">
            {/* <RadioGroup
              className='control'
              value={selected && selected.CategoryId}
              onChange={updateSelected}
            >
              {categories.map(c => (
                <RadioButton
                  value={c.CategoryId}
                  key={c.CategoryId}
                >{c.CategoryName}</RadioButton>
              ))}
            </RadioGroup> */}
            <Tabs className="control" defaultActiveKey={selected && selected.CategoryId} onChange={updateSelected}>
              {categories.map(c => (
                <TabPane key={c.CategoryId} tab={c.CategoryName} />
              ))}
            </Tabs>

            {selected && selected.ChList.length ? (
              <div className="category-container">
                {selected.ChList.map(it => (
                  <span key={it.CategoryId} className="category-item">
                    {it.CategoryName}
                  </span>
                ))}
              </div>
            ) : (
              <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
            )}
          </div>
        ) : (
          <Empty img={img} text="当前页面无数据" style={{ color: '#000', marginTop: 20 }} />
        )}
      </Spin>
    );
  }

  _renderMessages () {
    // 绘制系统消息
    const { messages, updateSelectedMessage, messageTotal, pageSize, currentPage, onMessagePageChange } = this.props.homePage;
    return (
      <div className="messages">
        {messages.length ? (
          <div className="message-container">
            {messages.map((it, i) => (
              <div key={i} className="message-item">
                <div className="time">{it.EditTime}</div>
                <div className="type">【消息】</div>
                <div className="preview">{it.Content}</div>
                <div className="more" onClick={() => updateSelectedMessage(it)}>
                  详情&gt;
                </div>
              </div>
            ))}
            <Pagination total={messageTotal} current={currentPage} pageSize={pageSize} onChange={onMessagePageChange} size="small" hideOnSinglePage={true} />
          </div>
        ) : (
          <Empty img={img} text="当前页面无数据" style={{ color: '#000' }} />
        )}
      </div>
    );
  }

  _renderStatistic () {
    // 绘制底部可设计品类模块与系统消息模块
    return (
      <Row className="statistic">
        <Col span={12}>
          <Panel title="可设计品类" logo={goodsImg}>
            {this._renderCategory()}
          </Panel>
        </Col>
        <Col span={12}>
          <Panel title="系统消息" logo={sysImg}>
            {this._renderMessages()}
          </Panel>
        </Col>
      </Row>
    );
  }
  _goto = url => () => {
    // 跳转模块对应的页面
    this.props.route.push(url);
  };

  _renderBrand () {
    // 绘制首页中部展示系统的三个主要业务模块（待选择设计、商品众测、生产订单）
    return (
      <Row className="brand" gutter={38}>
        <Col span={8} onClick={this._goto('/design/choose')}>
          <ModernCard colors={['#4CBECC', '#7AD9E5']} className="card" style={{ backgroundImage: `url(${chooseDesign})` }}>
            <div className="shadow">待选择设计</div>
          </ModernCard>
        </Col>
        <Col span={8} onClick={this._goto('/goods/presell')}>
          <ModernCard colors={['#B9B8F1', '#CAD9FF']} className="card" style={{ backgroundImage: `url(${presell})` }}>
            <div className="shadow">商品众测</div>
          </ModernCard>
        </Col>
        <Col span={8} onClick={this._goto('/order/productOrder')}>
          <ModernCard colors={['#FF6666', '#FF8787']} className="card" style={{ backgroundImage: `url(${order})` }}>
            <div className="shadow">生产订单</div>
          </ModernCard>
        </Col>
      </Row>
    );
  }

  _renderMessageDetail () {
    // 绘制系统消息-查看详情
    const { selectedMessage, updateSelectedMessage } = this.props.homePage;
    const close = () => updateSelectedMessage();
    return (
      <Modal visible={!!selectedMessage} title="消息" onCancel={close} onOk={close}>
        <span>{selectedMessage && selectedMessage.Content}</span>
      </Modal>
    );
  }

  render () {
    const { Ads } = this.props.homePage;
    return (
      <div className="home-page">
        <Carousel autoplay={true}>
          {Ads.map((it, index) => (
            <a key={index} href={it.ADSkipLink ? it.ADSkipLink : 'javascript:void(0)'} target="_blank" rel="noopener noreferrer">
              <img src={it.ADUrl ? it.ADUrl : banner} className="banner" />
            </a>
          ))}
        </Carousel>

        {this._renderBrand()}
        {this._renderStatistic()}
        {this._renderMessageDetail()}
      </div>
    );
  }
}

export default HomePage;

// Echats Options:
// option = {
//   tooltip: {
//       show: true,
//       trigger: 'axis',
//       axisPointer: {
//           type: 'line',
//           axis: 'auto',
//           snap: true
//       }
//   },
//   xAxis: {
//       type: 'category',
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   },
//   yAxis: {
//       type: 'value'
//   },
//   series: [{
//       data: [820, 932, 901, 934, 1290, 1330, 1320],
//       type: 'line'
//   }]
// };
