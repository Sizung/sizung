import React, { PropTypes } from 'react';
import * as styles from './Toasts.css';

import Toast from '../Toast';

class Toasts extends React.Component {
  render() {
    const { toasts } = this.props;

    const elements = toasts.map((toast, index) => {
      const toastStyle = { zIndex: index + 1, position: 'absolute', bottom: index * 20 + 'px', right: index * 20 + 'px' };

      return <Toast key={toast.id} toast={toast} style={ toastStyle } />;
    });

    return <div className={ styles.root }>{ elements }</div>;
  }
}

Toasts.propTypes = {
  toasts: PropTypes.object.isRequired,
};

export default Toasts;
