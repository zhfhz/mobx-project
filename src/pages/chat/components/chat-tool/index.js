import React, { Component } from 'react';
import EmojiSelectorBtn from './emoji-selector-btn';
import ImgSelectorBtn from './img-selector-btn';
import FileSelectorBtn from './file-selector-btn';
import CloseChatBtn from './close-chat-btn';
import HelpBtn from './help-btn';
import './styles.scss';

export class ToolBar extends Component {
  render () {
    const { onChange } = this.props;
    return (
      <div className="toolbar">
        <div className="columns" style={{ lineHeight: '2vh', height: '2vh', margin: '5px 0' }}>
          <EmojiSelectorBtn onChange={onChange} />
          <ImgSelectorBtn />
          <FileSelectorBtn />
          <HelpBtn />
          <CloseChatBtn />
        </div>
      </div>
    );
  }
}
