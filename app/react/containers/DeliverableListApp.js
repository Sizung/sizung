// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeliverableList from '../components/DeliverableList/index';
import * as DeliverableListActions from '../actions/deliverables';
import { fillDeliverable } from '../utils/entityUtils';
import { getPath, getAgendaItemIdFromPath, getDeliverableIdFromPath } from '../utils/pathUtils';

function mapStateToProps(state, props) {
  const selectedDeliverableId = props.params.deliverableId;
  const selectedAgendaItemId = props.params.agendaItemId;

  var deliverables = state.getIn(['entities', 'deliverables']).map(function(deliverable) {
    return fillDeliverable(state, deliverable.id);
  }).filter((deliverable) => {
    return !deliverable.agendaItem.archived && !deliverable.archived;
  }).toList().sortBy(function(conversationObject) {
    return conversationObject.dueOn ? 'A' + conversationObject.dueOn : 'B' + conversationObject.createdAt;
  });

  if (selectedAgendaItemId) {
    deliverables = deliverables.filter(function(deliverable) {
      return deliverable.agendaItemId === selectedAgendaItemId;
    });
  }

  return {
    deliverables: deliverables,
    selectedDeliverableId: selectedDeliverableId
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DeliverableListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableList);
