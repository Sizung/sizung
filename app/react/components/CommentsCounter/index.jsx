import React, { PropTypes } from 'react';
import ChatIcon from '../ChatIcon';
import styles from './index.css';

class CommentsCounter extends React.Component {
  render() {
    const { count, inverted, style } = this.props;

    return (
      <div className={styles.root} style={style}>
        <ChatIcon inverted={inverted}/>
        <small>{' ' + count}</small>
      </div>
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
