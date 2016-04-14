import React, { PropTypes } from 'react';
import PlusIcon from '../PlusIcon';
import styles from './index.css';

class CloseIcon extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['round', 'transparent']),
    inverted: PropTypes.bool,
    size: PropTypes.string,
    status: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    type: 'round',
    style: {},
  }

  renderTransparent = () => {
    return (
      <div className={styles.transparentContainer} style={ this.props.style }onClick={this.props.onClick}>
        <div className={styles.transparent}></div>
      </div>
    );
  }

  renderRound = () => {
    const { inverted, size, status } = this.props;
    return (
      <div className={styles.rotate} onClick={this.props.onClick}>
        <PlusIcon inverted={inverted} size={size} status={status} />
      </div>
    );
  }

  render() {
    return this.props.type === 'round' ? this.renderRound() : this.renderTransparent();
  }
}

export default CloseIcon;
