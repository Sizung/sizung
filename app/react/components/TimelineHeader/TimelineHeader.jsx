import React, { PropTypes } from 'react';

import AgendaItemAsTimelineHeader from '../AgendaItemAsTimelineHeader/index';
import DeliverableAsTimelineHeader from '../DeliverableAsTimelineHeader/index';

class TimelineHeader extends React.Component {
  render() {
    const { parent } = this.props;
    const parentType = parent.type;

    if (!parentType) { return <div />; }

    if (parentType === 'agendaItems') {
      return <AgendaItemAsTimelineHeader agendaItem={parent} />;
    }

    if (parentType === 'deliverables') {
      return <DeliverableAsTimelineHeader deliverable={parent} />;
    }
    return <div />;
  }
}

TimelineHeader.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default TimelineHeader;
