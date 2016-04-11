import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import EmailInput from '../EmailInput';
import PasswordInput from '../PasswordInput';
import { Link } from 'react-router';
import * as api from '../../utils/api';

class OrganizationSettings extends React.Component {

  static propTypes = {
  };

  handleSave = () => {
    if (this.validateForm()) {
      alert('Updating the form');
    }
  };

  handleCancel = () => {
    //Find the React way of doing it
    window.history.back();
  };

  render() {
    return (
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            TEAM SETTINGS
          </div>
          <div className={styles.actionContainer}>
            <div className={styles.formSubmit} onClick={this.handleSave} tab-index='4'>
              SAVE
            </div>
            <div className={styles.backLink} onClick={this.handleCancel}>
              CANCEL
            </div>
          </div>
        </div>
    );
  }
}

export default OrganizationSettings;
