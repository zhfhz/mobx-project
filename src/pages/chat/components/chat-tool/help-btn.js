import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import addUser from '@assets/img/加入.png';
import { inject, observer } from 'mobx-react';

@inject('chatList')
@observer
class HelpBtn extends Component {
  render () {
    const { askServer, visible, handleCancel, current } = this.props.chatList;
    if (current.ChatTarget.MemStyle === '2') {
      return (
        <div>
          <img src={addUser} alt="🌤" title="官方客服协作" onClick={askServer} />
          <Modal
            className="room-modal"
            title="提示"
            visible={visible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel} style={{ background: '#33CCCC', color: '#fff' }}>
                我知道了
              </Button>
            ]}
          >
            <p>官方客服已在群聊中，您有问题可直接反馈，请勿重复邀请协作！</p>
          </Modal>
        </div>
      );
    }
    return null;
  }
}
export default HelpBtn;
