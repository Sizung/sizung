// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeliverableList from '../components/DeliverableList/index';
import * as DeliverableListActions from '../actions/deliverables';
import { fillDeliverable } from '../utils/entityUtils';

function mapStateToProps(state) {
  const pathElements = state.get('routing').path.split('/');
  const selectedDeliverableId = pathElements.length >= 6 ? pathElements[6] : null;

  var deliverables = state.getIn(['entities', 'deliverables']).map(function(deliverable) {
    return fillDeliverable(state, deliverable.id);
  }).toList().sortBy(function(conversationObject) {
    return conversationObject.createdAt;
  });

  return {
    deliverables: deliverables,
    selectedDeliverableId: selectedDeliverableId
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DeliverableListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableList);
