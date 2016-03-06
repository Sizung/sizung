import React, { PropTypes } from 'react';
import styles from './index.css';

class DeliverableIcon extends React.Component {

  constructor() {
    super();
    this.validSizes = ['normal', 'large'];
  }
  render() {
    const iconStyle = [];
    const { inverted, size, status } = this.props;
    const iconSize = (this.validSizes.indexOf(size) === -1) ? this.validSizes[0] : this.validSizes[this.validSizes.indexOf(size)];
    if (inverted) {
      iconStyle.push(styles.inverted);
    } else {
      if (status === 'overdue') {
        iconStyle.push(styles.overdue);
      } else if (status === 'dueToday') {
        iconStyle.push(styles.dueToday);
      } else if (status === 'completed') {
        iconStyle.push(styles.completed);
      } else {
        iconStyle.push(styles.default);
      }
    }

    iconStyle.push(iconSize === 'normal' ? styles.normal : styles.large);
    return (
      <div className={iconStyle.join(' ')}></div>
    );
  }
}

DeliverableIcon.propTypes = {
  inverted: PropTypes.bool,
  size: PropTypes.string,
  status: PropTypes.string,
};

DeliverableIcon.defaultProps = {
  inverted: false,
  size: 'normal',
  status: 'default',
};

export default DeliverableIcon;
