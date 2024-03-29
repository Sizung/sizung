import React, { PropTypes } from 'react';
import styles from './index.css';

class ConversationIcon extends React.Component {

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
      <span className={styles[iconStyle]} style={style}>
      </span>
    );
  }
}

ConversationIcon.propTypes = {
  inverted: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.string,
};

ConversationIcon.defaultProps = {
  inverted: false,
  size: 'normal',
};

export default ConversationIcon;
