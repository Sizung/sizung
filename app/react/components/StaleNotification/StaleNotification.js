import React from 'react';
import styles from './StaleNotification.css';

class StaleNotification extends React.Component {
  constructor() {
    super();
    this.state = { stale: false };
  }

  componentDidMount() {
    this.staleChecker = window.setInterval(() => {
      const stale = window.App.cable.connectionMonitor.connectionIsStale();
      if (stale !== this.state.stale) {
        this.setState({ stale });
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.staleChecker);
  }

  render() {
    if (!this.state.stale) {
      return <div></div>;
    }

    return <div className={ styles.root }>Trying to reconnect with Sizung...</div>;
  }
}

export default StaleNotification;
