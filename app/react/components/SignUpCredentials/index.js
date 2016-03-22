import React, { PropTypes } from 'react';
import styles from './index.css';
import SizungInputApp from '../../containers/SizungInputApp';

class SignUpCredentials extends React.Component {

  static propTypes = {
    updateState: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.refs.email.focus();
  }

  handleNextClick = () => {
    this.props.updateState('information');
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.leftColumn}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
            </div>
            <div className={styles.logoTitle}>
            </div>
          </div>
          <div className={styles.stagesContainer}>
            <div className={styles.currentStage}>
              <span style={{ marginRight: '10px'}}>
                Credentials
              </span>
              <span className={styles.caretLeft}>
              </span>
            </div>
            <div className={styles.stage}>
              Information
            </div>
          </div>
        </div>
        <div className={styles.rightColumn} >
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>
              Add your credentials
            </div>
            <div className={styles.formSubTitle}>
              Add your email address as a username to sign into Sizung, along with a secure password.
            </div>
            <div className={styles.formInput}>
              <div className={styles.formInputLabel}>
                EMAIL ADDRESS
              </div>
              <div className={styles.formInputValue}>
                <input ref='email' type='email' placeholder="eg: username@domain.com" tab-index='1' autoFocus/>
              </div>
            </div>
            <div className={styles.formInput}>
              <div className={styles.formInputLabel}>
                PASSWORD
              </div>
              <div className={styles.formInputValue}>
                <input type='password' placeholder="min 8 character password" tab-index='2'/>
              </div>
            </div>
            <div className={styles.formInput}>
              <div className={styles.formInputLabel}>
                CONFIRM PASSWORD
              </div>
              <div className={styles.formInputValue}>
                <input type='password' rows="1" placeholder="" tab-index='3'/>
              </div>
            </div>
            <div className={styles.actionContainer}>
              <div className={styles.formSubmit} onClick={this.handleNextClick}>
                NEXT
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpCredentials;
