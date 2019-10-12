import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import './style.scss';
import { Navigation } from '../../components/navigation/index';
import { Info, ParamInfo } from '../../components/show-info';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';
// import { toJS} from 'mobx'

interface Props extends RouteComponentProps<{}> {
  match: { params: any };
}

@inject('detail')
@observer
class DetailPage extends Component<Props> {
  componentDidMount () {
    const s = this.props.detail;
    const code = this.props.match.params.id;
    s.GoodsSeriesCode = code;
    s.getData();
  }
  back = () => {
    window.history.back();
  };
  render () {
    const {
      GoodsKind,
      GoodsSeriesTitle,
      CategoryName1,
      CategoryName2,
      CategoryName3,
      GoodsSeriesName,
      GoodsSeriesKeywords,
      GoodsSeriesMatch,
      GoodsSeriesAfterSale,
      GoodsSeriesPhotos,
      GoodsSeriesDetail,
      GoodsSeriesParams,
      GoodsSeriesUnit,
      EndTime,
      PresellNum,
      DepositRate,
      SeriesParams
    } = this.props.detail.Data;
    const { GoodsSurfaceImg, GoodsSeriesQuality, priceList } = this.props.detail;
    return (
      <div className="goods-detail-page">
        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fff' }}>
          <Navigation tags={['商品管理', '常规商品']} />
        </div>
        <div style={{ marginBottom: '12px', backgroundColor: '#fff', padding: '12px', fontSize: '12px' }}>
          <h4 style={{ margin: '0', padding: '0 0 6px', borderBottom: '1px solid #EAEAEA' }}>基本信息</h4>
          <Info label="商品名称" txt={GoodsSeriesTitle} />
          <Info label="商品行业" txt={CategoryName1} />
          <Info label="商品品类" txt={CategoryName2 + '-' + CategoryName3} />
          <Info label="商品简称" txt={GoodsSeriesName} />
          <Info label="商品卖点" txt={GoodsSeriesKeywords} />
          <Info label="商品配套" txt={GoodsSeriesMatch} />
          <Info label="服务承诺" txt={GoodsSeriesAfterSale ? GoodsSeriesAfterSale.join('、') : ''} description={GoodsSeriesQuality ? GoodsSeriesQuality : []} />
        </div>
        <div style={{ marginBottom: '12px', backgroundColor: '#fff', padding: '12px', fontSize: '12px' }}>
          <h4 style={{ margin: '0', padding: '0 0 6px', borderBottom: '1px solid #EAEAEA' }}>商品轮播图和详情页</h4>
          <Info label="商品封面图" img={GoodsSurfaceImg.length ? GoodsSurfaceImg : []} />
          <Info label="商品轮播图" img={GoodsSeriesPhotos && GoodsSeriesPhotos !== '[]' ? GoodsSeriesPhotos : []} />
          <Info label="商品详情页" img={GoodsSeriesDetail ? GoodsSeriesDetail : []} />
        </div>
        <div style={{ marginBottom: '12px', backgroundColor: '#fff', padding: '12px', fontSize: '12px' }}>
          <h4 style={{ margin: '0', padding: '0 0 6px', borderBottom: '1px solid #EAEAEA' }}>商品参数和规格</h4>
          <span style={{ fontWeight: 'bold', display: 'inline-block', marginTop: '16px' }}>商品规格</span>
          <br />
          {GoodsSeriesParams ? GoodsSeriesParams.map((it, index) => <Info key={index} label={it.ParamName} txt={it.ParamValue} />) : null}
          <span style={{ fontWeight: 'bold' }}>商品参数</span>
          {SeriesParams && SeriesParams.length ? SeriesParams.map((it, index) => <ParamInfo key={index} label={it.ParamName} params={it.ParamValueList} />) : null}
        </div>
        <div style={{ marginBottom: '12px', backgroundColor: '#fff', padding: '12px', fontSize: '12px' }}>
          <h4 style={{ margin: '0', padding: '0 0 6px', borderBottom: '1px solid #EAEAEA' }}>商品价格</h4>
          <table className="mytable">
            <thead>
              <tr>
                {SeriesParams && SeriesParams.length ? SeriesParams.map((it, index) => <th key={index}>{it.ParamName}</th>) : null}
                <th>起订量</th>
                <th>市场不含税价</th>
                <th>市场含税价</th>
              </tr>
            </thead>
            <tbody>
              {priceList && priceList.length
                ? priceList.map((it, index) => (
                  <tr key={index}>
                    {SeriesParams && SeriesParams.length ? SeriesParams.map((item, idx) => <td key={idx}>{it.GoodsParamsDict[item.ParamName]}</td>) : null}
                    <td>{it.SetNum}</td>
                    <td>{it.NowMarketNoTax}</td>
                    <td>{it.NowMarketTax}</td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
          <Info label="商品单位" txt={GoodsSeriesUnit} />
          {GoodsKind === '1' ? <Info label="截止时间" txt={EndTime} /> : null}
          {GoodsKind === '1' ? <Info label="众测数量" txt={PresellNum} /> : null}
          {GoodsKind === '1' ? <Info label="定金金额" txt={DepositRate} /> : null}
          <div style={{ textAlign: 'center' }}>
            <Button type="default" onClick={this.back}>
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailPage;
