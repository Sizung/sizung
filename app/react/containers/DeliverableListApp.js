// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeliverableList from '../components/DeliverableList/index';
import * as DeliverableListActions from '../actions/deliverables';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  const conversationId = props.conversationId;
  const agendaItemId = props.agendaItemId;
  const selectedDeliverableId = props.deliverableId;

  const deliverables = agendaItemId ?
    selectors.deliverablesForAgendaItem(state, agendaItemId) :
    selectors.deliverablesForConversation(state, conversationId);

  return {
    deliverables,
    selectedDeliverableId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DeliverableListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableList);
