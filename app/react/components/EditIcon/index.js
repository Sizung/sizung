import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class EditIcon extends React.Component {

  static propTypes = {
    inverted: PropTypes.bool,
    style: PropTypes.object,
    size: PropTypes.oneOf(['normal']),
  };

  static defaultProps = {
    inverted: false,
    size: 'normal',
  };

  render() {
    const { inverted, style, size } = this.props;
    const invertedClass = inverted ? styles.light : styles.dark;
    const sizeClass = styles[size];

    return <div className={[invertedClass, sizeClass].join(' ')} style={style}></div>;
  }
}

export default EditIcon;
