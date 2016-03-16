import * as transform from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';
import * as constants from './constants';
import { routeActions } from 'redux-simple-router';

const toggleConversationMembersView = (toggle) => {
  return (dispatch) => {
    dispatch({
      type: constants.TOGGLE_CONVERSATION_MEMBERS,
      toggle,
    });
  };
};

export {
    toggleConversationMembersView,
};
