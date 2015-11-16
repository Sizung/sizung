import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';

import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';

import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import ConversationObjectListApp from './ConversationObjectListApp';
import UserListApp from './UserListApp';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import DeliverableInTimeline from '../components/DeliverableInTimeline';
import AgendaItemInTimeline from '../components/AgendaItemInTimeline';
import {fillConversationObject} from '../utils/entityUtils';
import ApplicationLayout from '../components/ApplicationLayout';

class App extends Component {
  render() {
    const { selectedAgendaItem } = this.props;
    const { currentConversation, createComment, deleteComment, createAgendaItem, createDeliverable, currentUser, conversationObjects } = this.props;

    if(selectedAgendaItem) {
      const conversationObjectComponents = conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          return <Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.createdAt} deleteComment={deleteComment}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable}/>
        }
      });
      return (
                <ApplicationLayout currentUser={currentUser}>
                  <UserListApp className="pull-right"/>
                  <div className="col-xs-12 zero-padding">
                    <div className="col-xs-3">
                      <AgendaItemListApp />
                    </div>
                    <div className="col-xs-6 padding-xs-horizontal">
                      <Button href="#" onClick={this.props.closeAgendaItem}>Close</Button>
                      <AgendaItemInTimeline agendaItem={selectedAgendaItem} />

                      <div className='comments'>
                        {conversationObjectComponents}
                      </div>

                      <CommentForm createComment={createComment}
                                   createDeliverable={createDeliverable}
                                   currentUser={currentUser}
                                   parent={selectedAgendaItem} />
                    </div>
                    <div className="col-xs-3">
                      <DeliverableListApp />
                    </div>
                  </div>
                </ApplicationLayout>
             );
    }
    else {
      return (
                <ApplicationLayout currentUser={currentUser}>
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
                </ApplicationLayout>
             );
    }
  }
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
  const selectedAgendaItemId = state.getIn(['selectedConversationObject', 'id']);
  const selectedAgendaItem = selectedAgendaItemId ? state.getIn(['entities', 'agendaItems', selectedAgendaItemId]) : null;

  var conversationObjects;
  if (selectedAgendaItem) {
    conversationObjects = state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]).map(function(reference) {
      return fillConversationObject(state, reference);
    }).reverse();
  }

  return {
    selectedAgendaItem: selectedAgendaItem,
    currentConversation: currentConversation,
    conversationObjects: conversationObjects,
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions, ...DeliverableActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);