import React from 'react';
// import img from '../../assets/img/empty.png'

/**
 *
 * @param {*} param0
 */
export default function EmptyView ({ style, className, text, img }) {
  // const { text } = this.props.app

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, ...style }} className={className || ''}>
      <img style={{ width: 160 }} src={img} alt="这是空的" />
      <div style={{ fontSize: '.875em', color: '#ffffff', ...style, marginTop: 14 }}>{text}</div>
    </div>
  );
}
