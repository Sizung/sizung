import React, { PropTypes } from 'react';
import styles from './index.css';

class ResolveIcon extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    size: PropTypes.string,
    resolved: PropTypes.bool,
  };

  static defaultProps = {
    size: 'normal',
    resolved: false,
  };

  render() {
    const iconStyle = [];
    const { size, resolved } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    iconStyle.push(resolved ? styles.resolved : styles.default);
    iconStyle.push(styles[iconSize]);

    return (
        <div className={iconStyle.join(' ')} style={this.props.style}></div>
    );
  }
}

export default ResolveIcon;
