import React, { PropTypes } from 'react';
import styles from './index.css';

class ChatIcon extends React.Component {

  static propTypes = {
    inverted: PropTypes.bool,
    style: PropTypes.object,
    size: PropTypes.oneOf(['normal', 'large']),
  };

  static defaultProps = {
    inverted: false,
    size: 'normal',
  };

  render() {
    const { inverted, style, size } = this.props;
    const invertedClass = inverted ? styles.white : styles.gray;
    const sizeClass = styles[size];

    return <span className={[invertedClass, sizeClass].join(' ')} style={style}></span>;
  }
}

export default ChatIcon;
