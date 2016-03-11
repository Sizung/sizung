import React, { PropTypes } from 'react';
import styles from './index.css';

class DeliverableIcon extends React.Component {

  render() {
    const iconStyle = [];
    const { inverted, size, status } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    const iconStatus = (styles[status] ? status : 'default');
    if (inverted) {
      iconStyle.push(styles.inverted);
    } else {
      iconStyle.push(styles[iconStatus]);
    }
    iconStyle.push(styles[iconSize]);

    return (
      <div className={iconStyle.join(' ')} style={this.props.style}></div>
    );
  }
}

DeliverableIcon.propTypes = {
  inverted: PropTypes.bool,
  size: PropTypes.string,
  status: PropTypes.string,
  style: PropTypes.object,
};

DeliverableIcon.defaultProps = {
  inverted: false,
  size: 'normal',
  status: 'default',
  style: {},
};

export default DeliverableIcon;
