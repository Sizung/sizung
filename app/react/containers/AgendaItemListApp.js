// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AgendaItemList from '../components/AgendaItemList/index';
import * as AgendaItemListActions from '../actions/agendaItems';
import Immutable from 'immutable';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  console.log(props.params.conversationId);
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', props.params.conversationId]);

  return {
    agendaItems: agendaItemIdsToShow ? selectors.agendaItemsList(state, agendaItemIdsToShow.get('references')) : [],
    selectedId: props.params.agendaItemId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemListActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemList);
