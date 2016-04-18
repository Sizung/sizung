import React, { PropTypes } from 'react';
import styles from './index.css';

class ArchiveIcon extends React.Component {

  render() {
    const iconStyle = [];
    const { size, inverted } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    if (inverted) {
      iconStyle.push(styles.inverted);
    } else {
      iconStyle.push(styles.default);
    }
    iconStyle.push(styles[iconSize]);

    return (
        <div className={iconStyle.join(' ')} style={this.props.style}></div>
    );
  }
}

ArchiveIcon.propTypes = {
  style: PropTypes.object,
  size: PropTypes.string,
  inverted: PropTypes.bool,
};

ArchiveIcon.defaultProps = {
  inverted: false,
  size: 'normal',
};

export default ArchiveIcon;
