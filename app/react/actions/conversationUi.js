/*
  This Action creator file handles the UI state of components for the conversation view
  For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */

import * as constants from './constants';

// Rename the function appropriately for example ... setConversationMemberViewVisibility ... problem here is the logic is set-logic but names is confusing
// Store is available if needed but

const showConversationMembers = (visibility) => {
  return {
    type: constants.SHOW_CONVERSATION_MEMBERS,
    visibility,
  };
};

const resetConversationUi = () => {
  return {
    type: constants.RESET_CONVERSATION_UI,
  };
};

export {
    showConversationMembers,
    resetConversationUi,
};
