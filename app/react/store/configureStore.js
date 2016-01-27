// Here the redux store gets created and configured.

import { compose, createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { browserHistory } from 'react-router';
import { syncHistory } from 'redux-simple-router';

let finalCreateStore;

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(browserHistory);

/* global __DEVELOPMENT__, __DEVTOOLS__ */
if (__DEVELOPMENT__ && __DEVTOOLS__) {
  // const { devTools, persistState } = require('redux-devtools');
  const createLogger = require('redux-logger');
  const logger = createLogger({
    collapsed: true,
    duration: true,
    stateTransformer: (state) => {
      return state.toJS();
    },
  });

  finalCreateStore = compose(
    applyMiddleware(thunk, reduxRouterMiddleware, logger)
    // Provides support for DevTools:
    // devTools(),

    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    // persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(thunk, reduxRouterMiddleware)
  )(createStore);
}

const configureStore = () => {
  const initialState = Immutable.fromJS({});
  const store = finalCreateStore(rootReducer, initialState);
  /* global __DEVELOPMENT__ */
  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};

export default configureStore;
