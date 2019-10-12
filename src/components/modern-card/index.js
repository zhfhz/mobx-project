import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Color from 'color'
import _ from 'lodash'


export default class ModernCard extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    colors: PropTypes.arrayOf(PropTypes.string),
  }
  static defaultProps = {
    colors: ['white'],
    className: '',
    style: {},
  }
  static getDerivedStateFromProps(props, state) {
    if (_.xor(props.colors, state.colors).length) {
      return {
        colors: props.colors,
        parsedColor: Color(props.colors[0])
      }
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      colors: props.colors,
      parsedColor: Color(props.colors[0]),
      hover: false,
    }
  }
  _onMouseEnter = () => {
    this.setState({ hover: true })
  }
  _onMouseLeave = () => {
    this.setState({ hover: false })
  }
  render() {
    const {
      parsedColor,
      colors,
      hover,
    } = this.state
    const {
      className,
      style,
      children,
    } = this.props
    const gen = {
      backgroundImage: `radial-gradient(${colors.join(',')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'all .28s',
      borderRadius: 4,
      ...style,
    }
    if (hover) {
      gen.boxShadow = `0 0 12px 0 ${parsedColor.fade(0.3).string()}`
    } else {
      gen.boxShadow = ' 0px 2px 11px 0px rgba(0,0,0,0.1)'
    }
    return (
      <div
        className={`${className}`}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        style={gen}
      >
        {children}
      </div>
    )
  }
}