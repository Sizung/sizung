// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AgendaItemList from '../components/AgendaItemList';
import * as AgendaItemListActions from '../actions/agendaItems';
import Immutable from 'immutable';

function mapStateToProps(state) {
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', state.getIn(['currentConversation', 'id'])]) || Immutable.List();

  var agendaItems = agendaItemIdsToShow.map(function(agendaItemId){
    return state.getIn(['entities', 'agendaItems', agendaItemId]);
  }).toList();

  agendaItems = agendaItems.map(function(agendaItem) {
      return {
        id: agendaItem.id,
        title: agendaItem.title,
        commentsSize: 0,
        conversation: state.getIn(['entities', 'conversations', agendaItem.conversationId])
      }
    });

  return {
    agendaItems: agendaItems
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AgendaItemListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemList);
