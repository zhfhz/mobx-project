import React, { Component } from 'react';
import waitaudit from '../../assets/img/sousuo_none.png';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
interface Props extends RouteComponentProps<{}> {}
class RegsiterFailed extends Component<Props> {
  reSubmit = () => {
    this.props.history.push('/sign/certificate');
  };
  render () {
    return (
      <div style={{ height: '100%', paddingTop: 120, textAlign: 'center', backgroundColor: '#FFF', color: '#333' }}>
        <img src={waitaudit} />
        <p style={{ color: '#EE5B5B', marginTop: 30 }}>很抱歉，审核未通过！</p>
        <p>未通过原因：</p>
        <p>{sessionStorage['AuditReason']}</p>
        <p>
          <Button type="default" style={{ color: '#4dbecd', borderColor: '#4dbecd' }} onClick={this.reSubmit}>
            重新提交
          </Button>
        </p>
      </div>
    );
  }
}
export default RegsiterFailed;
