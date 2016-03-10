import React, { PropTypes } from 'react';
import PlusIcon from '../PlusIcon';
import styles from './index.css';

class CloseIcon extends React.Component {

  render() {
    const { inverted, size, status } = this.props;
    return (
      <div className={styles.rotate} onClick={this.props.onClick}>
        <PlusIcon inverted={inverted} size={size} status={status} />
      </div>
    );
  }
}

CloseIcon.propTypes = {
  inverted: PropTypes.bool,
  size: PropTypes.string,
  status: PropTypes.string,
  onClick: PropTypes.func,
};

export default CloseIcon;