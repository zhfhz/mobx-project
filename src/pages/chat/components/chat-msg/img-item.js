import React from 'react';
import './styles.scss';

/**
 * 图片消息
 * @param {*} param0
 */
function ImgItem ({ item }) {
  // 众测商品列表
  return (
    <div className="text">
      <a href={item.MsgContent} target="_blank" rel="noopener noreferrer">
        <img src={item.MsgContent} />
      </a>
    </div>
  );
}

export default ImgItem;
