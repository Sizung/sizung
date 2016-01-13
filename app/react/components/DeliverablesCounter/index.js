import React, { PropTypes } from 'react';
import DeliverableIcon from '../DeliverableIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)

class DeliverablesCounter extends React.Component {
  render() {
    const { count, inverted } = this.props;

    return (
      <div styleName='root'>
        <DeliverableIcon inverted={inverted}/>
        <small>{' ' + count}</small>
      </div>
    );
  }
}

DeliverablesCounter.propTypes = {
  count: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
};

DeliverablesCounter.defaultProps = {
  inverted: false,
};

export default DeliverablesCounter;
