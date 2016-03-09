import React, { PropTypes } from 'react';
import styles from './index.css';

class PlusIcon extends React.Component {

  render() {
    const iconStyle = [];
    const { inverted, size, status } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    const iconColor = (styles[status] ? status : 'default');
    if (inverted) {
      iconStyle.push(styles.inverted);
    } else {
      iconStyle.push(styles[iconColor]);
    }
    iconStyle.push(styles[iconSize]);

    return (
      <div className={iconStyle.join(' ')}>{'+'}</div>
    );
  }
}

PlusIcon.propTypes = {
  inverted: PropTypes.bool,
  size: PropTypes.string,
  status: PropTypes.string,
};

PlusIcon.defaultProps = {
  inverted: false,
  size: 'normal',
  status: 'default',
};

export default PlusIcon;
