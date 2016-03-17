import React, { PropTypes } from 'react';
import styles from './index.css';

class AgendaItemIcon extends React.Component {

  static propTypes = {
    inverted: PropTypes.bool,
    style: PropTypes.object,
    size: PropTypes.oneOf(['normal', 'small', 'large', 'xLarge']),
  };

  static defaultProps = {
    inverted: false,
    size: 'normal',
  };

  render() {
    const { inverted, style, size } = this.props;
    const invertedClass = inverted ? styles.white : styles.gray;
    const sizeClass = styles[size];

    return <div className={[invertedClass, sizeClass].join(' ')} style={style}></div>;
  }
}

export default AgendaItemIcon;
