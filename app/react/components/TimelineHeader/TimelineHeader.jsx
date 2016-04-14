import React, { PropTypes } from 'react';

import AgendaItemAsTimelineHeader from '../AgendaItemAsTimelineHeader/index';
import DeliverableAsTimelineHeader from '../DeliverableAsTimelineHeader/index';

class TimelineHeader extends React.Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
  };

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

export default TimelineHeader;
