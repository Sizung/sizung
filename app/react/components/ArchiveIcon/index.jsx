import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ArchiveIcon extends React.Component {

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

ArchiveIcon.propTypes = {
  style: PropTypes.object,
  size: PropTypes.string,
};

ArchiveIcon.defaultProps = {
  inverted: false,
  size: 'normal',
};

export default ArchiveIcon;
