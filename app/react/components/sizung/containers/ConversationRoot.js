// This is the Root container for the conversation page
// This is the page where the user gets redirected to after sign in
// See /views/conversations/show.html.haml for the corresponding rails view

// This top-level root container component is there to
// create and configure the store
// bind the underlying app container component to the store
// and (if necessary) run an initializing action with data that should be rendered during server-side rendering.

// this.props.comments comes from the rails view where we put the data in that is coming from the rails controller
// We then create a setComments action with that data to initially put the data into the store.

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import CommentListApp from './CommentListApp';
import UserListApp from './UserListApp';
import configureStore from '../store/configureStore';
import {setCurrentUser} from '../actions/users'
import {setComments, createCommentRemoteOrigin, deleteCommentRemoteOrigin} from '../actions/comments'
import {setAgendaItems} from '../actions/agendaItems'
import {setDeliverables} from '../actions/deliverables'
import {setUsers, updateUserRemoteOrigin} from '../actions/users'
import {setCurrentConversation} from '../actions/conversations'

const store = configureStore();

export default class ConversationRoot extends Component {
  componentWillMount() {
    store.dispatch(setCurrentUser(this.props.currentUser));
    store.dispatch(setComments(this.props.currentConversation, this.props.comments));
    store.dispatch(setAgendaItems(this.props.agendaItems));
    store.dispatch(setCurrentConversation(this.props.currentConversation));
    store.dispatch(setDeliverables(this.props.deliverables));
    store.dispatch(setUsers(this.props.users));
  }

  componentDidMount() {
    window.App.comments.setOnReceived(function (data) {
      if(store.getState().getIn(['currentUser', 'id']) !== data.actor_id) {
        if(data.action == 'create') {
          store.dispatch(createCommentRemoteOrigin(data.comment));
        }
        else if(data.action == 'delete') {
          store.dispatch(deleteCommentRemoteOrigin(data.comment));
        }
      }
    });


    window.App.appearance.setOnReceived(function (data) {
      console.log('Activity in appearance: ', data);
      store.dispatch(updateUserRemoteOrigin(data.user));
    });

  }
  render() {
    if (__DEVTOOLS__) {
      // React components for Redux DevTools
      const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
      return (
        <div>
          <Provider store={store}>
            {
              () =>
                <div>
                  <div className="col-xs-3">
                    <AgendaItemListApp />
                  </div>
                  <div className="col-xs-6">
                    <UserListApp />
                    <CommentListApp />
                  </div>
                  <div className="col-xs-3">
                    <DeliverableListApp />
                  </div>
                </div>
            }
          </Provider>
          <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
          </DebugPanel>
        </div>
      );
    } else {
      return (
        <div>
          <Provider store={store}>
            {
              () =>
                <div>
                  <div className="col-xs-3">
                    <AgendaItemListApp />
                  </div>
                  <div className="col-xs-6">
                    <CommentListApp />
                  </div>
                  <div className="col-xs-3">
                    <DeliverableListApp />
                  </div>
                </div>
            }
          </Provider>
        </div>
      );
    }
  }
}
