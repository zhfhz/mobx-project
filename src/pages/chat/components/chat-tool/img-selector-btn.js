import React, { Component } from 'react';
import tupian from '@assets/img/tupian.png';
import { inject, observer } from 'mobx-react';

@inject('chatSender')
@observer
class ImgSelectorBtn extends Component {
  _upload = async () => {
    const file = this.Image && this.Image.files && this.Image.files[0];
    const { validFileAndSend } = this.props.chatSender;
    const result = await validFileAndSend('image', file);
    if (!result.status) {
      this.Image.value = '';
    }
  };
  _openImage = () => {
    this.Image.click();
  };
  render () {
    return (
      <div>
        <div className="file_c">
          <img src={tupian} alt="🌤" title="选择图片" onClick={this._openImage} />
          <input id="file" type="file" ref={r => (this.Image = r)} accept="image/*" onChange={this._upload} />
        </div>
      </div>
    );
  }
}
export default ImgSelectorBtn;
