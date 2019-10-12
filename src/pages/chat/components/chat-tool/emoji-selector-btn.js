import React, { Component } from 'react';
import { Popover } from 'antd';
import biaoqing from '@assets/img/biaoqing.png';
import { inject, observer } from 'mobx-react';

const EmojiList = '😂-😱-😭-😘-😳-😒-😏-😄-😔-😍-😉-😜-😁-😝-😰-😓-😚-😌-😊-💪-👊-👍-☝-👏-✌-👎-🙏-👌-👈-👉-👆-👇-👀-👃-👄-👂-🍚-🍝-🍜-🍙-🍧-🍣-🎂-🍞-🍔-🍳-🍟-🍺-🍻'.split('-');

const HideEmoji = function () {
  if (this.state.showEmoji) {
    this.setState({
      showEmoji: false
    });
  }
};

@inject('chatSender')
@observer
class EmojiSelector extends Component {
  state = {
    showEmoji: false
  };

  componentDidMount () {
    this.emojiListener = HideEmoji.bind(this);
    document.addEventListener('click', this.emojiListener, false);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.emojiListener, false);
  }

  showEmojiHandle = e => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      showEmoji: !this.state.showEmoji
    });
  };

  render () {
    const { reciveToolBarInput } = this.props.chatSender;
    return (
      <div>
        <Popover
          visible={this.state.showEmoji}
          content={
            <div style={{ overflowWrap: 'break-word', width: '200px' }}>
              {EmojiList.map((e, i) => (
                <span
                  style={{ cursor: 'pointer' }}
                  key={i}
                  onClick={() => {
                    reciveToolBarInput('emoji', e);
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          }
        >
          <img src={biaoqing} alt="🌤" style={{ marginLeft: '8px' }} title="表情" onClick={this.showEmojiHandle} />
        </Popover>
      </div>
    );
  }
}
export default EmojiSelector;
