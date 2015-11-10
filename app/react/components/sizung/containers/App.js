import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';

import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import ConversationObjectListApp from './ConversationObjectListApp';
import UserListApp from './UserListApp';
import CommentForm from '../components/CommentForm';

class App extends Component {
  render() {
    const { selectedAgendaItem } = this.props;
    const { currentConversation, createComment, deleteComment, createAgendaItem, currentUser } = this.props;

    const selectedRender = (
      <div className="container gray-bg zero-padding full-width">
        <div className="row">
          <div className="col-lg-12">
            <UserListApp className="pull-right"/>
            <div className="col-xs-12 zero-padding">
              <div className="col-xs-3">
                <AgendaItemListApp />
              </div>
              <div className="col-xs-6 padding-xs-horizontal">
                <h1>{this.props.selectedAgendaItem}</h1>
                <CommentForm createComment={createComment}
                             currentUser={currentUser}
                             parent={currentConversation} />
              </div>
              <div className="col-xs-3">
                <DeliverableListApp />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const defaultRender = (
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
    );

    if(selectedAgendaItem) {
      return selectedRender;
    }
    else {
      return defaultRender;
    }
  }
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);

  return {
    selectedAgendaItem: state.getIn(['selectedConversationObject', 'id']),
    currentConversation: currentConversation,
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);