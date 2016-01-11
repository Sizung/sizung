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
import { fetchConversationObjects } from '../actions/conversationObjects';
import { fetchOrganizations, setCurrentOrganization } from '../actions/organizations';
import { setAgendaItems } from '../actions/agendaItems';
import { setUnseenObjects } from '../actions/unseenObjects';
import { transformUnseenObjectFromJsonApi, transformOrganizationFromJsonApi, transformConversationMemberFromJsonApi } from '../utils/jsonApiUtils';
import { setDeliverables } from '../actions/deliverables';
import { setUsers } from '../actions/users';
import { setConversationMembers } from '../actions/conversationMembers';
import { setCurrentConversation } from '../actions/conversations';
import ApplicationLayoutApp from './ApplicationLayoutApp';
import ConversationLayoutApp from './ConversationLayoutApp';
import AgendaItemApp from './AgendaItemApp';
import DeliverableApp from './DeliverableApp';
import ConversationApp from './ConversationApp';

import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';
import { setupWebSocket } from '../utils/websocketUtils';

const store = configureStore();
const history = createBrowserHistory();
syncReduxAndRouter(history, store, (state) => state.get('routing'));

export default class Root extends Component {
  componentWillMount() {
    store.dispatch(setCurrentUser(this.props.currentUser));
    store.dispatch(setUsers(this.props.users));
    store.dispatch(setCurrentOrganization(transformOrganizationFromJsonApi(this.props.currentOrganization.data)));
  }

  componentDidMount() {
    //store.dispatch(setUnseenObjects(this.props.unseenObjects.data.map(transformUnseenObjectFromJsonApi)));
    store.dispatch(fetchConversationObjects('conversations', this.props.currentConversation.id));
    store.dispatch(fetchOrganizations());
    setupWebSocket(store);
  }

  render() {
    const toRender = () =>
      (
        <Router history={history}>
          <Route path="/" component={ApplicationLayoutApp}>
            <Route path="/conversations" component={ConversationLayoutApp}>
              <Route path="/conversations/:conversationId" component={ConversationApp} />
              <Route path="/conversations/:conversationId/agenda_items/:agendaItemId" component={AgendaItemApp}/>
              <Route path="/conversations/:conversationId/agenda_items/:agendaItemId/deliverables/:deliverableId" component={DeliverableApp}/>
            </Route>
          </Route>
        </Router>
      );

    /* global __DEVTOOLS__ */
    if (__DEVTOOLS__) {
      // React components for Redux DevTools
      const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
      return (
        <div>
          <Provider store={store}>
            { toRender }
          </Provider>
          <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
          </DebugPanel>
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
