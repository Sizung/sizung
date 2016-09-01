import React, { PropTypes } from 'react';
import * as api from '../../utils/api';
import styles from './Trace.css';
import Immutable from 'immutable';
import * as transform from '../../utils/jsonApiUtils';
import { Link } from 'react-router';

class FormInput extends React.Component {

  static propTypes = {
    objectList: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      trace: false,
      message: 'trial',
      objectList: [],
    };
  }

  handleClose = () => {
    this.setState({
      trace: false,
    });
  };

  handleShowTrace = () => {
    api.postJson('/api/traces', { trace: { type: this.props.type, id: this.props.id } }, (json) => {
      //if (json.length > 0) {
        this.setState({ message: 'Data fetched', objectList: json.data.map(transform.transformObjectFromJsonApi) });
      //} else {
      //  this.setState({ message: 'Problem Fetching Data' });
      //}
    });
    this.setState({
      trace: true,
    });
  };

  render() {
    if (this.state.trace) {
      return this.renderShowTrace();
    }
    return this.renderAction();
  }

  renderAction = () => {
    return (
        <div className={styles.action} onClick={this.handleShowTrace}>
          <i className={styles.traceIcon}></i>
        </div>
    );
  };

  renderTrace = () => {
    return (
        this.state.objectList.map((obj, index) => {
          return (
              <div className={styles.row}>
                <Link className={styles[obj.type]} to={'/' + transform.reverseTransformTypeFromJsonApi(obj.type) + '/' + obj.id}>
                  {obj.title + ' ( ' + obj.type + ' ) '}
                </Link>
                <i className={styles.arrow}></i>
              </div>
          );
        })
    );
  };

  renderShowTrace = () => {
    return (
        <div className={styles.root}>
          <div className={styles.container}>
            <div className={styles.closeIcon} onClick={this.handleClose}></div>
            <div className={styles.content}>
              {this.renderTrace()}
              <div className={styles.row}>
                <div className={styles.object}>
                  {'Current Organization'}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };
}

export default FormInput;
