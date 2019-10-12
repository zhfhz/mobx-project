import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Navigation } from '../../components/navigation'
import { Search } from '../../components/search/search'
import { Etable } from '../../components/e-table'
import { Switch } from '../../components/switch'
import rules from '../../assets/img/rule.png'
import store from '../../assets/img/store.png'
import img from '../../assets/img/empty.png'
import Empty from '../../components/empty/index'
import { openMsgWindow } from '../../services/winref'
import {
  Modal, Button
} from 'antd'
import './index.scss'

const cols = (page) => [
  {
    title: '设计信息',
    key: 'info',
    render (row) {
      return (
        <div style={{height: '80px', width: '320px', display: 'flex'}}>
          <div style={{width: '80px', height: '80px'}}>
            {row.GoodsPhoto ? <img alt="设计封面" src={row.GoodsPhoto} style={{width: '100%', height: '100%'}}/>
              : <div style={{height: '100%', border: '1px solid #EAEAEA', textAlign: 'center', lineHeight: '80px'}}>暂无图片</div>
            }
          </div>
          <div style={{flex: '1', paddingLeft: '15px'}}>
            <div className="wrap" style={{marginBottom: '6px', height: '54px'}}>{row.GoodsSeriesTitle}</div>
            <p style={{marginBottom: '0', color: '#999999', position: 'relative'}}>
              设计说明：
              <span className="ellipsis" title={row.DesignDesc} style={{position: 'relative', top: '-18px', left: '54px'}} >
                {row.DesignDesc}
              </span>
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: '品类',
    // dataIndex: 'GoodsSeriesName',
    key: 'CategoryName',
    align: 'center',
    render (row) {
      return (
        <div>
          {row.CategoryName2}-{row.CategoryName3}
        </div>
      )
    }
  },
  {
    title: '设计编号',
    dataIndex: 'GoodsSeriesCode',
    align: 'center'
  },
  {
    title: '设计师分成比例',
    // dataIndex: 'DesignRate',
    key: 'DesignRate',
    align: 'center',
    render (row) {
      return (
        <div>{(row.DesignRate * 100).toFixed(0)}%</div>
      )
    }
  },
  {
    title: '工厂选择',
    // dataIndex: 'explain',
    align: 'center',
    key: 'explain',
    render (row) {
      return (
        <div>
          已有<span style={{color: 'red'}}>{row.CoopNum}家</span>工厂选择
        </div>
      )
    }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    // eslint-disable-next-line react/display-name
    render (row) {
      return (
        <span>
          <Link to={'/design/choose/detail/' + row.GoodsSeriesCode}>查看详情</Link>
          {row.IsCoop == 0
            ? <span style={{marginLeft: '10px', color: '#33CCCC', cursor: 'pointer'}} onClick={page.showChooseModal.bind(this, row.GoodsSeriesCode)}>选择合作</span>
            : (row.IsCoop == 1 ? '' : '')
          }
        </span>
      )
    }
  }]
const cooperateCols = () => [
  {
    title: '设计信息',
    key: 'info',
    render (row) {
      return (
        <div style={{height: '80px', display: 'flex'}}>
          <div style={{width: '80px', height: '80px'}}>
            {row.GoodsPhoto ? <img alt="设计封面" src={row.GoodsPhoto} style={{width: '100%', height: '100%'}}/>
              : <div style={{height: '100%', border: '1px solid #EAEAEA', textAlign: 'center', lineHeight: '80px'}}>暂无图片</div>
            }
          </div>
          <div style={{flex: '1', paddingLeft: '15px', width: '82px'}}>
            <div className="wrap" style={{marginBottom: '6px', height: '54px'}}>{row.GoodsSeriesTitle}</div>
            <p style={{marginBottom: '0', color: '#999999', position: 'relative'}}>
              设计说明：
              <span className="ellipsis" title={row.DesignDesc} style={{position: 'absolute', top: '0', left: '54px'}}>
                {row.DesignDesc}
              </span>
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: '品类',
    // dataIndex: 'GoodsSeriesName',
    key: 'CategoryName2',
    align: 'center',
    render (row) {
      return (
        <div>
          {row.CategoryName2}-{row.CategoryName3}
        </div>
      )
    }
  },
  {
    title: '设计编号',
    dataIndex: 'GoodsSeriesCode',
    align: 'center',
  },
  {
    title: '设计师分成比例',
    // dataIndex: 'DesignRate',
    key: 'DesignRates',
    align: 'center',
    render (row) {
      return (
        <div>{(row.DesignRate * 100).toFixed(0)}%</div>
      )
    }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    // eslint-disable-next-line react/display-name
    render (row) {
      return (
        <span>
          <Link to={'/design/choose/detail/' + row.GoodsSeriesCode}>查看详情</Link>
          {/* <span style={{marginLeft: '10px',color:'#33CCCC',cursor: 'pointer'}} onClick={page.showChooseModal.bind(this,row.GoodsSeriesCode)}>取消合作</span> */}
        </span>
      )
    }
  }]

@inject(stores => ({
  product: stores.product,
}))
@observer

class Product extends Component {
  toChat = (url, name, headImageUrl) => {
    // console.log(url, name)
    openMsgWindow(url, name, headImageUrl)
  }
  row = (it) => (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <span>
        <span style={{display: 'inline-block', width: '300px', verticalAlign: 'middle'}}>
          <span>设计编号：{it.GoodsSeriesCode}</span> &nbsp;&nbsp;
          <span>{it.StoreName}</span>
        </span>
        <a href="javscript:void(0)" style={{color: '#33CCCC'}} onClick={this.toChat.bind(this, '/chat/' + it.DesignUserId, it.StoreName, it.DRHeadImageUrl)}><img src={store} style={{marginRight: 5}}/>联系设计师</a>
      </span>
      <span>编辑时间：{it.EditWhen}</span>
    </div>
  )

  showChooseModal = (GoodsSeriesCode) => {
    this.props.product.visible = true
    this.props.product.choiceGoodsSeriesCode = GoodsSeriesCode
  }
  componentDidMount () {
    const { getDesignManage } = this.props.product
    getDesignManage()
  }
  componentWillUnmount () {
    const url = window.location.href
    const { dispose } = this.props.product
    if (url.indexOf('/design/choose') === -1) {
      dispose()
    }
  }
  render () {
    const { visible, visible1, curStatLabel, dataDisplay } = this.props.product
    const s = this.props.product
    return (
      <div className="product" style={{padding: '0 10'}}>
        <div className="chooseDesign" style={{display: 'flex', justifyContent: 'space-between'}}>
          <Navigation tags={['选择设计']}/>
          <Search keyword={s.keyword} change={s.keywordChange} search={s.search}/>
        </div>
        <div className="chooseDesign" style={{padding: '12px', position: 'relative', minHeight: 'calc(100% - 160px)'}}>
          <Switch tabs={[
            {label: '待选择', click: s.changeStat('待选择')},
            {label: '已合作', click: s.changeStat('已合作')}
          ]}
          cur={curStatLabel}
          />
          <span style={{position: 'absolute', top: '12px', right: '0', marginRight: '12px', color: '#FFC600', cursor: 'pointer'}} onClick={s.showcooperateModal}>
            <img src={rules} alt="" />
            平台合作规则
          </span>
          {curStatLabel === '待选择' ? (dataDisplay.length ? <Etable
            columns={cols(this)}
            data={dataDisplay}
            rowItem={this.row}
            pagination={{...s.paging}}
          /> : <Empty img={img} text='当前页面无数据' style={{ color: '#000' }} />) : (dataDisplay.length ? <Etable
            columns={cooperateCols(this)}
            data={dataDisplay}
            rowItem={this.row}
            pagination={{...s.paging}}
          /> : <Empty img={img} text='当前页面无数据' style={{ color: '#000' }} />)
          }
        </div>
        <Modal className="product-tip-modal" title="提示" visible={visible} onCancel={s.close} onOk={s.handleOk} cancelText="取消" okText="确定">
          <p>确定选择合作了吗?合作双方职责请查看右上角的平台合作规则!</p>
        </Modal>
        <Modal className="product-cooperate-modal" title="合作平台规则" visible={visible1} closable={false} onCancel={s.close} footer={[<Button key="ok" onClick={s.handleOk1}>我知道了</Button>]}
        >
          <p>一、设计师和工厂在都市智造平台选择合适自己的工厂和设计作品；</p>
          <p>二、基本原则是互惠互利，做自己擅长的事情；</p>
          <p>三、设计师负责设计，商品模特图片，商品详情页制作，解答用户的疑问和销售相关的问题；</p>
          <p>四、工厂负责提供样品或者产品渲染图（根据不同的行业决定）；</p>
          <p>五、平台作为双方合作的监管第三方，保证用户，设计师，工厂三方的利益；</p>
          <p>六、详细工作流内容请点击首页工作流程图，如有疑问，请咨询官方客服。</p>
        </Modal>
      </div>
    )
  }
}

export default Product
