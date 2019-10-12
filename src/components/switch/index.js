import React, { Component } from 'react'
import './style.scss'

// 参数：
// tabs: [{
//   label: '',
//   click: (label) => {},
//   num: number,
//   data: data
// }]
// cur: label

export class Switch extends Component {

  click = (label, fn) => () => {
    fn(label)
  }

  render() {
    const p = this.props
    return (
      <div className="switch_comp">
        {
          p.tabs.map((t, i) => {
            return (
              <span key={i} className="wrapper" onClick={this.click(t.label, t.click)}>
                <a href="javascript: void(0)" className="_label"
                  style={{
                    color: p.cur === t.label ? '#33CCCC' : undefined,
                    paddingBottom: '10px',
                    borderBottom: p.cur === t.label ? '2px solid #33CCCC' : 'none',
                    position: 'relative'
                  }}
                >
                  {t.label}
                  {t.num ? <span 
                    style={{
                      position: 'absolute', 
                      top: '-6px',
                      background: 'red',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      color: '#fff',
                      textAlign: 'center',
                      lineHeight: '16px',
                      display: 'inline-block',
                      fontSize: '12px',
                      WebkitTransformOriginX: '0',
                      WebkitTransform: 'scale(0.66)'}}>{t.num < 100 ? t.num : '99+'}</span> : null}
                  {t.data ? <span 
                    style={{
                      position: 'absolute', 
                      top: '-6px',
                      background: 'red',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      color: '#fff',
                      textAlign: 'center',
                      lineHeight: '16px',
                      display: 'inline-block',
                      fontSize: '12px',
                      WebkitTransformOriginX: '0',
                      WebkitTransform: 'scale(0.66)'}}>{t.data}</span> : null}
                </a>
              </span>
            )
          })
        }
      </div>
    )
  }

}
