import React, { Component, PropTypes } from 'react';
import styles from "./index.css";

class UnseenBadge extends React.Component {
  renderBadge(count) {
    return (
      <div className={styles.container}>
        <div className={styles.badge}>
        </div>
      </div>
    );
  }

  render() {
    const count = this.props.count;
    return count && count > 0 ? this.renderBadge(count) : <div></div>;
  }
}

UnseenBadge.propTypes = {
  count: PropTypes.number.isRequired
};

export default UnseenBadge;
