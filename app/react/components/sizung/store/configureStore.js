// Here the redux store gets created and configured.

import { compose, createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

export default function configureStore() {
  const initialState = Immutable.fromJS({});
  const store = createStoreWithMiddleware(rootReducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
