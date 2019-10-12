import React from 'react';
import './styles.scss';

/**
 * 商品图标
 * @param {*} param0 商品项
 */
function GoodsItemIcon ({ src, desc }) {
  return (
    <div className="img-container" style={{ position: 'relative' }}>
      <div className="img" style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
      {desc ? (
        <span className="pre_tip" style={{ color: '#FFF' }}>
          {desc}
        </span>
      ) : null}
    </div>
  );
}

export default GoodsItemIcon;
