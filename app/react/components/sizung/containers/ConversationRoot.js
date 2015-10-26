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
import configureStore from '../store/configureStore';
import {setComments, createCommentRemoteOrigin} from '../actions/comments'
import {setAgendaItems} from '../actions/agendaItems'
import {setDeliverables} from '../actions/deliverables'
import {setCurrentConversation} from '../actions/conversations'

const store = configureStore();

export default class ConversationRoot extends Component {
  componentWillMount() {
    store.dispatch(setComments(this.props.currentConversation, this.props.comments));
    store.dispatch(setAgendaItems(this.props.agendaItems));
    store.dispatch(setCurrentConversation(this.props.currentConversation));
    store.dispatch(setDeliverables(this.props.deliverables));
  }

  componentDidMount() {
    window.App.comments.setOnReceived(function (data) {
      console.log('received new comment in react', data);
      store.dispatch(createCommentRemoteOrigin(data.comment));
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
