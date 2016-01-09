import { fillConversationObject } from './entityUtils';

const currentUser = (state) => state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
const currentConversation = (state) => state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
const currentOrganization = (state) => state.getIn(['entities', 'organizations', state.getIn(['currentOrganization', 'id'])]);
const organizations = (state) => state.getIn(['entities', 'organizations']).map((organization) => { return organization; }).toList();
const conversationMembers = (state) => state.getIn(['entities','conversationMembers']);

const conversationObjects = (state, objectsToShow) => {
  if (!objectsToShow) {
    return null;
  }

  return objectsToShow.get('references').map((objectReference) => {
    return fillConversationObject(state, objectReference);
  }).toList().sortBy((conversationObject) => {
    return conversationObject.createdAt;
  }).toJS();
};

export {
  currentUser,
  currentConversation,
  currentOrganization,
  organizations,
  conversationMembers,
  conversationObjects,
};
