import React from 'react'
import './style.scss'
import { Icon } from 'antd'

interface Opt {
    label: string;
    val: string;
}

interface Props {
    label: string;      // radio组的label
    value: string;    // 选中的项
    options: Opt[];     // 选项
    onchange(label: string, val: string): void; // 勾选后的回调
}

export class TransverseRadios extends React.Component< Props> {

    expend = false;

    onchange = (l, v) => () => {
      this.props.onchange(l, v)
    }

    onc = () => {
      this.expend = !this.expend
      this.setState({})
    }

    check = (i) => {
      const c = this.props.value
      if(c === i){
        return true
      }
      return false
    }

    render() {
      const p = this.props
      return (
        <div className="emake-transverse-radios" style={{height: this.expend ? 'auto' : '42px'}}>
          <label className="transverse-label">{p.label}</label>
          <ul className="transverse-radios-list">
            {
              p.options.map((ele, idx) => {
                return (
                  <li key={idx} title={ele.label}>
                    <input type="radio" id={p.label+ele.val} name={p.label} onChange={this.onchange(ele.label, ele.val)} value={ele.val} checked={this.check(ele.val)}/>
                    <label htmlFor={p.label+ele.val}>{ele.label}</label>
                  </li>
                )
              })
            }
          </ul>
          {
            this.expend ? <Icon onClick={this.onc} className="transverse-icon" type="minus" theme="outlined" />
              :
              <Icon onClick={this.onc} className="transverse-icon" type="plus" theme="outlined" />
          }
        </div>
      )
    }


}