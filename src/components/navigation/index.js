import React, { Component } from 'react'

// 使用示例：<Navigation tags={['系统首页', '首页设置']}/>

export class Navigation extends Component {
  render(){
    const tags = this.props.tags
    const len = tags.length-1
    return (
      <div style={{height: '32px', display: 'inline-block'}}>
        <span style={{verticalAlign: 'middle', display: 'inline-block', width: '2px', height: '66%', backgroundColor: 'rgb(48, 189, 197)'}}/>
        &nbsp;&nbsp;
        <span style={{verticalAlign: 'middle', display: 'inline-block', height: '32px', lineHeight: '32px', fontSize: '12px'}}>
          {
            tags.map((t, i) => (
              <span key={i} style={{color: len === i ? 'rgb(48, 189, 197)' : '#000'}}>
                {t}{len === i ? '' : '>'}
              </span>
            ))
          }
        </span>
      </div>
    )
  }
}
