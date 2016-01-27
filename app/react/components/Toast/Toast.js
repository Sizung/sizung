import React, { PropTypes } from 'react';
import styles from './Toast.css';

class Toast extends React.Component {
  render() {
    const { toast, style } = this.props;
    const { body } = toast;

    return <div className={ styles.root } style={ style }>{ body }</div>;
  }
}

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default Toast;
