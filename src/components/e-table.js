import React, { Component, Fragment } from 'react'
import { Table } from 'antd'

// data, columns, rowItem(function)

// 示例：
// const cols = [
//   {title: '商品信息', dataIndex: 'info'},
//   {title: '品类', dataIndex: 'cate'},
//   {title: '价格', dataIndex: 'price'}
// ]
// const data = [
//   {info: 'weqewq', cate: 'dad', price: '321', key: '1'},
//   {info: 'weqewq', cate: 'dad', price: '321', key: '2'},
//   {info: 'weqewq', cate: 'dad', price: '321', key: '3'},
//   {info: 'weqewq', cate: 'dad', price: '321', key: '4'},
//   {info: 'weqewq', cate: 'dad', price: '321', key: '5'}
// ]
// row = (it) => (
//   <div>
//     {it.cate}
//     &nbsp;&nbsp;
//     {it.price}
//   </div>
// )

// <Etable columns={cols} data={data} rowItem={row}/>


export class Etable extends Component {

  row = ({record, ...restProps}) => {
    const val = '1px solid #eaeaea'
    return (
      <Fragment>
        <tr>
          <td colSpan={this.props.columns.length} style={{background: '#fff', border: 'none', height: '12px', padding: '0'}}/>
        </tr>
        <tr style={{height: '30px', lineHeight: '30px', border: 'none', marginTop: '12px', borderTop: val, borderLeft: val, borderRight: val}}>
          <td colSpan={this.props.columns.length} style={{ background: '#f3f4f4', border: 'none', height: '30px', lineHeight: '30px', paddingTop: '0', paddingBottom: '0' }}>
            {this.props.rowItem(record)}
          </td>
        </tr>
        <tr {...restProps} style={{borderLeft: val, borderRight: val, backgroundColor: '#fff'}}/>
      </Fragment>
    )
  }

  handleRow = record => ({
    record
  })

  render() {
    return (
      <Table
        bordered={false}
        onRow={this.handleRow} 
        columns={this.props.columns} 
        dataSource={this.props.data}
        components={{
          body: {
            row: this.row
          }
        }}
        pagination={this.props.pagination}
      />
    )
  }

}