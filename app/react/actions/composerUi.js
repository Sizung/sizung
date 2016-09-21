/*
  This Action creator file handles the UI state of components for the conversation view
  For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */

import * as constants from './constants';

const setComposerState = (state) => {
  return {
    type: constants.SET_COMPOSER_STATE,
    state,
  };
};

const resetComposerState = (state) => {
  return {
    type: constants.RESET_COMPOSER_STATE,
    state,
  }
};

export {
    setComposerState,
    resetComposerState,
};
