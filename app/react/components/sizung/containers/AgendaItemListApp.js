// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AgendaItemList from '../components/AgendaItemList/index';
import * as AgendaItemListActions from '../actions/agendaItems';
import Immutable from 'immutable';
import { getPath, getAgendaItemIdFromPath } from '../utils/pathUtils';
import { fillAgendaItem } from '../utils/entityUtils';

function mapStateToProps(state) {
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', state.getIn(['currentConversation', 'id'])]) || Immutable.List();

  var agendaItems = agendaItemIdsToShow.map(function(agendaItemId){
    return state.getIn(['entities', 'agendaItems', agendaItemId]);
  }).toList();

  agendaItems = agendaItems.map(function(agendaItem) {
    return fillAgendaItem(state, agendaItem.id);
  }).filter((agendaItem) => {
    return !agendaItem.archived;
  }).sortBy(function(conversationObject) {
    return conversationObject.createdAt;
  });

  const selectedConversationObject = state.getIn(['selectedConversationObject', 'id']);
  const selectedAgendaItemId = getAgendaItemIdFromPath(getPath(state));

  return {
    agendaItems: agendaItems,
    selectedId: selectedAgendaItemId
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemListActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemList);
