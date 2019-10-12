import React from 'react';
import { Icon } from 'antd';
import './styles.scss';

/**
 * 聊天记录的消息类型为File
 * @param {*} item
 */
function FileItem ({ item }) {

  /**
   * File文件大小（B/KB/MB）
   * @param {*} fileSize
   */
  function _getFileSize (fileSize) {
    if (fileSize / 1024 < 1) {
      return fileSize + 'B';
    } else if (1 < fileSize / 1024 && fileSize / 1024 < 1024) {
      return (fileSize / 1024).toFixed(2) + 'KB';
    } else if (1 < fileSize / 1024 / 1024 && fileSize / 1024 / 1024 < 1024) {
      return (fileSize / 1024 / 1024).toFixed(2) + 'MB';
    }
  }

  /**
   * File文件下载
   */
  function _downloadFile (filePath) {
    window.open(filePath);
  }

  const data = item.MsgContent ? JSON.parse(item.MsgContent) : {};
  const { FileName, FilePath, FileSize } = data;
  return (
    <div className="design-item file">
      <div className="file-icon">
        <Icon type="file" theme="twoTone" />
      </div>
      <div className="title">
        <p style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{FileName}</p>
        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
          <span style={{ color: '#999' }}>{_getFileSize(FileSize)}</span>
          <span className="display-cursor" onClick={_downloadFile.bind(this, FilePath)}>
            <Icon type="download" />
          </span>
        </p>
      </div>
    </div>
  );
}

export default FileItem;
