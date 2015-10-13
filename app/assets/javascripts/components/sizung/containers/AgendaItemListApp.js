// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AgendaItemList from '../components/AgendaItemList';
import * as AgendaItemListActions from '../actions/agendaItems';

function mapStateToProps(state) {
  return {
    agendaItems: state.agendaItems
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AgendaItemListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemList);
