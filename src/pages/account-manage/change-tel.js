import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

@inject('changeTel')
@observer
class ChangeTel extends Component {
  render() {
    const { demo } = this.props.changeTel
    return (
      <div>{demo}</div>
    )
  }
}

export default ChangeTel
