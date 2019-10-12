import React, { Component } from 'react';
import waitaudit from '../../assets/img/shenhezhong.png';

class WaitAudit extends Component {
  render () {
    return (
      <div style={{ height: '100%', paddingTop: 120, textAlign: 'center', backgroundColor: '#FFF', color: '#333' }}>
        <img src={waitaudit} />
        <p style={{ color: '#4dbecd', marginTop: 30 }}>正在审核中</p>
        <p>都市智造超级线上工厂工作人员将在15个工作日内与您联系进行产能和相关资质审核</p>
        <p>
          如有疑问请拨打，客服热线：<span style={{ color: '#4dbecd', textDecoration: 'underline' }}>400-867-0211</span>
        </p>
      </div>
    );
  }
}
export default WaitAudit;
