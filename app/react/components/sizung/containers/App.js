import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import ConversationObjectListApp from './ConversationObjectListApp';
import UserListApp from './UserListApp';

class App extends Component {

  render() {
    return (
      <div>
        <h1>{this.props.selectedAgendaItem}</h1>
        <div className="container gray-bg zero-padding full-width">
          <div className="row">
            <div className="col-lg-12">
              <UserListApp className="pull-right"/>
              <div className="col-xs-12 zero-padding">
                <div className="col-xs-3">
                  <AgendaItemListApp />
                </div>
                <div className="col-xs-6 padding-xs-horizontal">
                  <ConversationObjectListApp />
                </div>
                <div className="col-xs-3">
                  <DeliverableListApp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  selectedAgendaItem: 'No one selected'
};

function mapStateToProps(state) {
  return {
    selectedAgendaItem: state.getIn(['selectedConversationObject', 'id'])
  }
}
export default connect(mapStateToProps)(App);