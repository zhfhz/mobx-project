import React, { Component } from 'react';
import './style.scss';
import exception_500 from '../../assets/img/500.png';
import { Button } from 'antd';

class Exception extends Component {
  render () {
    return (
      <div className="exception">
        <img src={exception_500} />
        <p>抱歉，服务器出错了</p>
        <Button type="primary" href="/homePage">
          返回首页
        </Button>
      </div>
    );
  }
}
export default Exception;
