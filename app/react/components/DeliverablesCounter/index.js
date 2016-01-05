import React, { PropTypes } from 'react';
import styles from './index.css';

class DeliverablesCounter extends React.Component {
  render() {
    const { count, inverted } = this.props;

    return (
      <span className={inverted ? styles.inverted : styles.normal}>
        <small>{count}</small>
      </span>
    );
  }
}

DeliverablesCounter.propTypes = {
  count: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
};

DeliverablesCounter.defaultProps = {
  inverted: false,
};

export default DeliverablesCounter;
