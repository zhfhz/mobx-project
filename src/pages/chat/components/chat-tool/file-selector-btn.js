import React, { Component } from 'react';
import file from '@assets/img/file.png';
import { inject, observer } from 'mobx-react';

@inject('chatSender')
@observer
class FileSelectorBtn extends Component {
  showFileSelector = () => {
    this.File.click();
  };
  // 选中文件，上传文件
  _uploadFile = async () => {
    const { validFileAndSend } = this.props.chatSender;
    const file = this.File && this.File.files && this.File.files[0];
    await validFileAndSend('file', file);
    this.File.value = '';
  };
  render () {
    return (
      <div>
        <div className="file_c">
          <img src={file} alt="🌤" title="选择文件" onClick={this.showFileSelector} style={{ width: 20, height: 20 }} />
          <input id="file" type="file" ref={r => (this.File = r)} onChange={this._uploadFile} />
        </div>
      </div>
    );
  }
}

export default FileSelectorBtn;
