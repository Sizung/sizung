import React from 'react';
import styles from './LoadingPage.css';

class LoadingPage extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.animatedLogo}>
        </div>
      </div>
    );
  }
}

export default LoadingPage;
