import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CommentListApp from './CommentListApp';
import configureStore from '../store/configureStore';
import {setComments} from '../actions/comments'

const store = configureStore();

export default class SizungRoot extends Component {
  componentWillMount() {
    store.dispatch(setComments(this.props.comments));
  }
  render() {
    return (
      <Provider store={store}>
        {() => <CommentListApp />}
      </Provider>
    );
  }
}
