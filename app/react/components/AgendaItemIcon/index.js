import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class AgendaItemIcon extends React.Component {

  constructor() {
    super();
    this.validSizes = ['normal', 'large', 'x-large', 'small', 'xLarge'];
  }

  render() {
    let iconStyle;
    const { inverted, style, size } = this.props;
    const iconSize = (this.validSizes.indexOf(this.props.size) === -1) ? this.validSizes[0] : this.props.size;
    if (iconSize === 'normal') {
      iconStyle = inverted ? 'inverted' : 'normal';
    } else {
      iconStyle = (inverted ? 'inverted-' : '') + size;
    }
    return (
        <span styleName={iconStyle} style={style}>
      </span>
    );
  }
}

AgendaItemIcon.propTypes = {
  inverted: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.string,
};

AgendaItemIcon.defaultProps = {
  inverted: false,
  size: 'normal',
};

export default AgendaItemIcon;
