import React, { Component } from 'react';
import styles from './styles.css';

export default class Spinner extends Component {
  render() {
    return (<div className={styles.wrapper}>
      <div className={styles.spinner}></div>
    </div>);
  }
}
