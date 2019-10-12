import React, { Component } from 'react'

// 参数：
// label：标题；txt?：文字内容；img?：图片URL(数组)，txt和img属性只传一种；align?：‘left’|‘right’，默认left

// 示例：
// <Info label="商品简称" txt="uqidhi的确会多起来QDHWIUDHWQLIU"/>
// <Info label="商品图片" img={[
//   'https://live-static.segmentfault.com/308/357/3083572615-59cb9959b3f87_render',
//   'https://live-static.segmentfault.com/308/357/3083572615-59cb9959b3f87_render',
// ]} description="文字描述"/>

export class Info extends Component {
  left = {
    display: 'inline-block',
    height: '18px',
    lineHeight: '18px',
    textAlign: 'left',
    verticalAlign: 'top',
    fontWeight: this.props.fontWeight
  }
  right = {
    display: 'inline-block',
    height: '18px',
    lineHeight: '18px',
    textAlign: 'right',
    width: '100px',
    verticalAlign: 'top',
    fontWeight: this.props.fontWeight
  }
  render() {
    const imgs = (this.props.img && this.props.img.length) ? this.props.img : undefined
    const description = (this.props.description && this.props.description.length) ? this.props.description : undefined
    const txt = this.props.txt || ''
    const label = this.props.label
    const align = this.props.align === 'right' ? 'right' : 'left'
    return (
      <div style={{fontSize: '12px', margin: '16px 0', lineHeight: '18px', whiteSpace: 'nowrap', paddingRight: '16px'}}>
        <span style={align === 'right' ? this.right : this.left}>{label}：</span>
        <div style={{display: 'inline-block', maxWidth: '80%', verticalAlign: 'top', whiteSpace: 'normal'}}>
          {
            imgs ? (
              imgs.map((m, i) => (
                <a key={i} href={m} target="_blank" rel="noopener noreferrer"><img alt="商品图片" src={m} style={{width: '80px', height: '80px', margin: '0 8px 8px 0'}}/></a>
              ))
            ) : txt
          }
          <br/>
          {
            description ? (
              description.map((m, i) => (
                <div style={{textAlign:'center',width:'80px',display:'inline-block',marginRight: '8px'}} key={i}>{m}</div>
              ))
            ) : ''
          }
        </div>
        
      </div>
    )
  }
}
export class ParamInfo extends Component {
  left = {
    display: 'inline-block',
    height: '18px',
    lineHeight: '18px',
    textAlign: 'left',
    verticalAlign: 'top',
    fontWeight: this.props.fontWeight
  }
  right = {
    display: 'inline-block',
    height: '18px',
    lineHeight: '18px',
    textAlign: 'right',
    width: '100px',
    verticalAlign: 'top',
    fontWeight: this.props.fontWeight
  }
  render() {
    const params = (this.props.params && this.props.params.length) ? this.props.params : undefined
    const label = this.props.label
    const align = this.props.align === 'right' ? 'right' : 'left'
    return (
      <div style={{fontSize: '12px', margin: '16px 0', lineHeight: '18px', whiteSpace: 'nowrap', paddingRight: '16px'}}>
        <span style={align === 'right' ? this.right : this.left}>{label}：</span>
        <div style={{display: 'inline-flex', maxWidth: '80%', verticalAlign: 'top', whiteSpace: 'normal'}}>
          {
            params.map((m, i) => (
              <div key={i} style={{marginRight: 15}}>
                {m.ParamOptionalIcon? <a key={i} href={m} target="_blank" rel="noopener noreferrer"><img alt="商品图片" src={m.ParamOptionalIcon} style={{width: '80px', height: '80px', margin: '0 8px 8px 0'}}/></a>: null}
                <p>{m.ParamOptionalName}</p>
              </div>
              
            ))
          }
        </div>
      </div>
    )
  }
}