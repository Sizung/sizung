import React, { PropTypes } from 'react';
import styles from './index.css';

class CommentsCounter extends React.Component {
  render() {
    const { count, inverted, style } = this.props;

    return (
      <span className={inverted ? styles.inverted : styles.normal} style={style}>
        <small>{count}</small>
      </span>
    );
  }
}

CommentsCounter.propTypes = {
  count: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  style: PropTypes.object,
};

CommentsCounter.defaultProps = {
  inverted: false,
};

export default CommentsCounter;
