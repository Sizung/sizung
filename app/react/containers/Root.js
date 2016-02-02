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
import configureStore from '../store/configureStore';
import { setCurrentUser } from '../actions/users';
import { fetchOrganizationsSuccess } from '../actions/organizations';
import { transformUserFromJsonApi, transformOrganizationFromJsonApi } from '../utils/jsonApiUtils';
import { setUsers } from '../actions/users';
import ApplicationLayoutApp from './ApplicationLayoutApp';
import ConversationLayoutApp from './ConversationLayoutApp';
import AgendaItemApp from './AgendaItemApp';
import DeliverableApp from './DeliverableApp';
import ConversationApp from './ConversationApp';
import OrganizationApp from './OrganizationApp';
import { bindActionCreators } from 'redux';
import * as channelHandlers from '../actions/channelHandlers';

import { Router, Route, browserHistory } from 'react-router';
import * as ws from '../utils/websocketUtils';

const store = configureStore();

export default class Root extends Component {
  componentWillMount() {
    store.dispatch(fetchOrganizationsSuccess(this.props.organizations.data.map(transformOrganizationFromJsonApi)));
    store.dispatch(setUsers(this.props.users.data.map(transformUserFromJsonApi)));
    store.dispatch(setCurrentUser(this.props.currentUser));
  }

  componentDidMount() {
    ws.followUserChannel(this.props.currentUser.id, bindActionCreators(channelHandlers.onUserChannelReceived, store.dispatch));
  }

  componentWillUnmount() {
    ws.unfollowUserChannel();
  }

  render() {
    const toRender =
      (
        <Router history={browserHistory}>
          <Route path="/" component={ApplicationLayoutApp}>
            <Route path="/agenda_items/:agendaItemId" component={AgendaItemApp}/>
            <Route path="/conversations/:conversationId" component={ConversationApp} />
            <Route path="/organizations/:organizationId" component={OrganizationApp} />
            <Route path="/conversations" component={ConversationLayoutApp}>
              <Route path="/conversations/:conversationId/agenda_items/:agendaItemId" component={AgendaItemApp}/>
              <Route path="/conversations/:conversationId/agenda_items/:agendaItemId/deliverables/:deliverableId" component={DeliverableApp}/>
            </Route>
          </Route>
        </Router>
      );

    /* global __DEVTOOLS__ */
    if (__DEVTOOLS__) {
      // React components for Redux DevTools
      // const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
      return (
        <div>
          <Provider store={store}>
            { toRender }
          </Provider>
        </div>
      );
    }

    return (
      <div>
        <Provider store={store}>
          { toRender }
        </Provider>
      </div>
    );
  }
}
