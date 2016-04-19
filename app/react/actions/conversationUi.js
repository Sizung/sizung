/*
  This Action creator file handles the UI state of components for the conversation view
  For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */

import * as constants from './constants';

const setConversationSettingsState = (state) => {
  return {
    type: constants.SET_CONVERSATION_SETTINGS_STATE,
    state,
  };
};

const resetConversationUi = () => {
  return {
    type: constants.RESET_CONVERSATION_UI,
  };
};

export {
    setConversationSettingsState,
    resetConversationUi,
};
