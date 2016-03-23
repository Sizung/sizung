import React, { PropTypes } from 'react';
import styles from './index.css';

class ResolveIcon extends React.Component {

  render() {
    const iconStyle = [];
    const { size, selected } = this.props;
    const iconSize = (styles[size] ? size : 'normal');
    if (selected) {
      iconStyle.push(styles.selected);
    } else {
      iconStyle.push(styles.unselected);
    }
    iconStyle.push(styles[iconSize]);

    return (
        <div className={iconStyle.join(' ')} style={this.props.style}></div>
    );
  }
}

ResolveIcon.propTypes = {
  selected: PropTypes.bool,
  size: PropTypes.string,
};

ResolveIcon.defaultProps = {
  selected: false,
  size: 'normal',
};

export default ResolveIcon;
