class SampleApp extends React.Component {

  sampleAppReducer(state, action) {
    const initialState = {
      counter: 0
    };
    if (typeof state === 'undefined') {
      return initialState;
    }

    // For now, don’t handle any actions
    // and just return the state given to us.
    return state;
  }

  render() {
    let store = Redux.createStore(this.sampleAppReducer);

    return(
      <ReactRedux.Provider store={store}>
        {
          () =>
            <ReactBootstrap.Button onClick={(e)=> store.dispatch(window.increaseCounter(1))} >
              {this.props.counter}
            </ReactBootstrap.Button>
        }
      </ReactRedux.Provider>
    )
  }
}

SampleApp.defaultProps = {
  counter: 0
};