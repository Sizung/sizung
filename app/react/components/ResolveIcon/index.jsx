import React, { PropTypes } from 'react';
import styles from './index.css';

class ResolveIcon extends React.Component {

  render() {
    const iconStyle = [];
    const { size, selected } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    iconStyle.push(styles.default);
    iconStyle.push(styles[iconSize]);

    return (
        <div className={iconStyle.join(' ')} style={this.props.style}></div>
    );
  }
}

ResolveIcon.propTypes = {
  style: PropTypes.object,
  size: PropTypes.string,
};

export default ResolveIcon;
