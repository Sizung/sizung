// App style container components are there to bind a Component (here AgendaItemList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeliverableList from '../components/DeliverableList';
import * as DeliverableListActions from '../actions/deliverables';

function mapStateToProps(state) {
  var deliverables = state.getIn(['entities', 'deliverables']).toList();

  return {
    deliverables: deliverables
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DeliverableListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableList);
