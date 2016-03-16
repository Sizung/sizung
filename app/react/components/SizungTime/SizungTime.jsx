import React, { PropTypes } from 'react';
import moment from 'moment';
import Time from 'react-time';

class SizungTime extends React.Component {
  static propTypes = {
    value: PropTypes.string,
  }

  render() {
    const { value } = this.props;
    const now = moment.utc();
    const pastOrNow = moment.utc(value) > now ? now : value;

    return <Time value={pastOrNow} titleFormat="YYYY/MM/DD HH:mm" relative />;
  }
}

export default SizungTime;
