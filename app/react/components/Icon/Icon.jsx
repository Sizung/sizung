import React, { PropTypes } from 'react';
import styles from './Icon.css';

class Icon extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['chat']).isRequired,
    position: PropTypes.oneOf(['left', 'right']).isRequired,
    style: PropTypes.object,
    gap: PropTypes.string,
    contentStyle: PropTypes.object,
    contentClassName: PropTypes.object,
  }
  static defaultProps = {
    position: 'left',
    style: {},
    gap: "",
    contentClassName: "",
    contentStyle: {},
  }
  
  render() {
    const { type, position, style, contentClassName, contentStyle } = this.props;
    const gap = position === 'left' ? { paddingRight: this.props.gap } : { paddingLeft: this.props.gap };
    
    return (
      <span>
        <span className={[styles.icon, styles[type]].join(' ')} style={{...gap, ...style}}>
        </span>
        <span className={contentClassName} contentStyle={contentStyle}>
          { this.props.children }
        </span>
      </span>
    );
  }
}

export default Icon;
