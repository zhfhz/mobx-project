import React, { Component } from 'react';
import { Input, Icon, Button } from 'antd';
import './style.scss';

// 示例：
// let key = ''
// const onchange = (val) => {
//   key = val
// }
// const search = () => {
//   console.log(key)
// }

// <Search keyword={key} change={onchange} search={search}/>

export class Search extends Component {
  onSearch = () => {
    if (!this.props.search) {
      return;
    }
    this.props.search();
  };
  onchange = e => {
    if (!this.props.change) {
      return;
    }
    this.props.change(e.target.value);
  };
  render () {
    return (
      <div className="emake_search" style={{ display: 'inline-block', width: '326px', height: '30px', lineHeight: '30px', whiteSpace: 'nowrap' }}>
        <Input
          value={this.props.keyword}
          onChange={this.onchange}
          prefix={<Icon type="search" />}
          style={{ verticalAlign: 'middle', width: '260px', borderRadius: '0', fontSize: '12px' }}
          placeholder="输入你想搜索的内容"
        />
        <Button onClick={this.onSearch} type="primary" style={{ verticalAlign: 'middle', borderRadius: '0', width: '66px' }}>
          搜索
        </Button>
      </div>
    );
  }
}
