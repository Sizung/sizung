import React, { PropTypes } from 'react';
import styles from './index.css';
import SizungInputApp from '../../containers/SizungInputApp';

class SignUpInformation extends React.Component {

  static propTypes = {
    updateState: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.refs.firstName.focus();
  }

  handleSubmitClick = () => {
    console.log('Validate and Call Ajax');
  };

  handleBackClick = () => {
    this.props.updateState('credentials');
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
            <div className={styles.previousStage}>
              <span style={{ marginRight: '10px'}}>
                Credentials
              </span>
              <span className={styles.tick}>
              </span>
            </div>
            <div className={styles.currentStage}>
              <span style={{ marginRight: '10px'}}>
                Information
              </span>
              <span className={styles.caretLeftWhite}>
              </span>
            </div>

          </div>
        </div>
        <div className={styles.rightColumn} >
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>
              Add your profile Information
            </div>
            <div className={styles.formSubTitle}>
              Just a little information about you.
            </div>
            <div className={styles.formInput}>
              <div className={styles.formInputLabel}>
                FIRST NAME
              </div>
              <div className={styles.formInputValue}>
                <input ref='firstName' type='text' autoFocus/>
              </div>
            </div>
            <div className={styles.formInput}>
              <div className={styles.formInputLabel}>
                LAST NAME
              </div>
              <div className={styles.formInputValue}>
                <input type='text'/>
              </div>
            </div>
            <div className={styles.actionContainer}>
              <div className={styles.backLink} onClick={this.handleBackClick}>
                <span className={styles.caretLeftBlack}></span>
                <span style={{marginLeft: '10px'}}>BACK</span>
              </div>
              <div className={styles.formSubmit}>
                SUBMIT
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpInformation;
