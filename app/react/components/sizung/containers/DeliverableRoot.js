// This top-level root container component is there to
// create and configure the store
// bind the underlying app container component to the store
// and (if necessary) run an initializing action with data that should be rendered during server-side rendering.

// this.props.agendaItems comes from the rails view where we put the data in that is coming from the rails controller
// We then create a setComments action with that data to initially put the data into the store.

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DeliverableListApp from './DeliverableListApp';
import configureStore from '../store/configureStore';
import {setDeliverables} from '../actions/deliverables'

const store = configureStore();

export default class DeliverableRoot extends Component {
  componentWillMount() {
    store.dispatch(setDeliverables(this.props.deliverables));
  }
  render() {
    return (
      <Provider store={store}>
        {() => <DeliverableListApp />}
      </Provider>
    );
  }
}
