import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input, Icon, Radio } from 'antd';
import Empty from '@components/empty/index';
import empty from '@assets/img/empty.png';
import { Switch } from '@components/switch';
import './styles.scss';
import DesignItem from '../chat-msg/design-item';
import GoodsItem from '../chat-msg/goods-item';
import OrderItem from '../chat-msg/order-item';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@inject('chatAbout', 'chatList', 'chatSender')
@observer
class ChatAbout extends React.Component {
  componentDidMount () {
    this.props.chatAbout.init();
  }
  _checkActiveLabel = label => {
    const { curStatLabel } = this.props.chatAbout;
    return label === curStatLabel;
  };
  _renderGoodslist () {
    const { firstCateList, firstCate, secCateList, secCate, GoodsList, changeFirstCate, changeSecCate, sendGoods } = this.props.chatAbout;
    return (
      <div className="goods_container">
        <div className="left_container">
          <ul>
            {firstCateList.map(it => (
              <li onClick={changeFirstCate(it)} key={it.CategoryId} className={firstCate.CategoryId === it.CategoryId ? 'active' : ''}>
                {it.CategoryName}
              </li>
            ))}
          </ul>
        </div>
        <div className="right_container">
          <div className="secCate_container">
            <ul>
              {secCateList.map(it => (
                <li onClick={changeSecCate(it)} key={it.CategoryId} className={secCate.CategoryId === it.CategoryId ? 'active' : ''}>
                  {it.CategoryName}
                </li>
              ))}
            </ul>
          </div>
          <div className="goods_container" style={{ flexDirection: 'column' }}>
            {GoodsList.length ? (
              GoodsList.map(it => <GoodsItem key={it.GoodsSeriesCode} item={it} onClick={() => sendGoods(it.GoodsSeriesCode)} />)
            ) : (
              <Empty img={empty} style={{ color: '#333', width: '100%', textAlign: 'center' }} text="暂无数据" />
            )}
          </div>
        </div>
      </div>
    );
  }
  _renderContent () {
    const { chatAbout } = this.props;
    const { DesignList, PreGoodsList, OrderList } = chatAbout;
    const { sendGoods, sendOrder, sendDesign } = this.props.chatSender;
    return (
      <div className="nav-content" style={{ paddingLeft: this._checkActiveLabel('常规商品') ? '0' : '10px' }}>
        {this._checkActiveLabel('选择设计') ? (
          DesignList.length ? (
            DesignList.map(it => <DesignItem key={it.GoodsSeriesCode} item={it} onSend={() => sendDesign(it)} />)
          ) : (
            <Empty img={empty} style={{ color: '#333' }} text="暂无数据" />
          )
        ) : null}
        {this._checkActiveLabel('众测商品') ? (
          PreGoodsList.length ? (
            PreGoodsList.map(it => <GoodsItem key={it.GoodsSeriesCode} item={it} onSend={() => sendGoods(it.GoodsSeriesCode)} />)
          ) : (
            <Empty img={empty} style={{ color: '#333' }} text="暂无数据" />
          )
        ) : null}
        {this._checkActiveLabel('常规商品') ? this._renderGoodslist() : null}
        {this._checkActiveLabel('生产订单') ? (
          OrderList.length ? (
            OrderList.map(it => <OrderItem key={it.OrderNo} item={it} onSend={() => sendOrder(it.OrderNo)} />)
          ) : (
            <Empty img={empty} style={{ color: '#333' }} text="暂无数据" />
          )
        ) : null}
      </div>
    );
  }
  _checkCurStatLabel = () => {
    const { curStatLabel } = this.props.chatAbout;
    switch (curStatLabel) {
    case '选择设计':
      return '设计编号';
    case '众测商品':
      return '商品名称';
    case '常规商品':
      return '商品名称';
    case '生产订单':
      return '订单编号';
    }
  };
  render () {
    const { current } = this.props.chatList;
    if (!current) {
      return null;
    }
    if (current && current.ChatType === '0' && current.ChatTarget.MemStyle === '3') {
      return (
        <div>
          <h1>公告</h1>
          <p>都市智造官方客服为您提供专业客服解答在使用都市智造超级线上工厂平台过程中存在的任何问题，您可以选择发送文件或直接发送图片给我们平台客服，都市智造官方客服竭诚为您服务！</p>
          <p>咨询投诉电话：400-867-0211</p>
        </div>
      );
    }
    // 聊天室右侧的设计、商品、订单
    const { changeStat, curStatLabel, keyword, keywordChange, RequestType, changeChooseStat, PreState, changePreStat, OrderState, changeOrderStat } = this.props.chatAbout;
    return (
      <div className="right-nav-container">
        <div className="nav-header">
          <Switch
            tabs={[
              { label: '选择设计', click: changeStat('选择设计') },
              { label: '众测商品', click: changeStat('众测商品') },
              { label: '常规商品', click: changeStat('常规商品') },
              { label: '生产订单', click: changeStat('生产订单') }
            ]}
            cur={curStatLabel}
          />
          <Input prefix={<Icon type="search" />} placeholder={'请输入' + this._checkCurStatLabel()} value={keyword} onChange={keywordChange} />
          {this._checkActiveLabel('选择设计') ? (
            <RadioGroup onChange={changeChooseStat} value={RequestType} buttonStyle="solid" className="selections">
              <RadioButton style={{ width: '28%' }} value="205">
                全部
              </RadioButton>
              <RadioButton style={{ width: '28%' }} value="206">
                待选择
              </RadioButton>
              <RadioButton style={{ width: '28%' }} value="207">
                已合作
              </RadioButton>
            </RadioGroup>
          ) : null}
          {this._checkActiveLabel('众测商品') ? (
            <RadioGroup onChange={changePreStat} value={PreState} buttonStyle="solid" className="selections">
              <RadioButton value="">全部</RadioButton>
              <RadioButton value="0">众测中</RadioButton>
              <RadioButton value="1">众测成功</RadioButton>
              <RadioButton value="-1">众测失败</RadioButton>
            </RadioGroup>
          ) : null}
          {this._checkActiveLabel('生产订单') ? (
            <RadioGroup onChange={changeOrderStat} value={OrderState} buttonStyle="solid" className="selections">
              <RadioButton value="">全部</RadioButton>
              <RadioButton value="1">待发货</RadioButton>
              <RadioButton value="2">已发货</RadioButton>
              <RadioButton value="3">已完成</RadioButton>
            </RadioGroup>
          ) : null}
        </div>
        {this._renderContent()}
      </div>
    );
  }
}

export default ChatAbout;
