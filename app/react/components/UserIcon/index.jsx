import React, { PropTypes } from 'react';
import styles from './index.css';

class UserIcon extends React.Component {

  static propTypes = {
    inverted: PropTypes.bool,
    style: PropTypes.object,
    size: PropTypes.oneOf(['normal']),
  };

  static defaultProps = {
    inverted: false,
    size: 'normal',
  };

  render() {
    const { style, size } = this.props;
    const colorClass = styles.gray;
    const sizeClass = styles[size];

    return <div className={[colorClass, sizeClass].join(' ')} style={style}></div>;
  }
}

export default UserIcon;
