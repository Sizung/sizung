import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ChatIcon extends React.Component {

  constructor() {
    super();
    this.validSizes = ['normal', 'large', 'x-large', 'small'];
  }
  render() {
    let iconSize;
    let iconStyle;
    const { inverted, style, size } = this.props;
    iconSize = (this.validSizes.indexOf(this.props.size) === -1) ? this.validSizes[0] : this.props.size;
    if (iconSize === 'normal') {
      iconStyle = inverted ? 'inverted' : 'normal';
    } else {
      iconStyle = (inverted ? 'inverted-' : '') + size;
    }

    return (
      <span styleName={iconStyle} style={style}>
      </span>
    );
  }
}

ChatIcon.propTypes = {
  inverted: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.string,
};

ChatIcon.defaultProps = {
  inverted: false,
  size: 'normal',
};

export default ChatIcon;
