import { fillConversationObject, fillAgendaItem } from './entityUtils';
import Immutable from 'immutable';

const organization = (state, organizationId) => {
  return state.getIn(['entities', 'organizations', organizationId]);
};

const conversation = (state, conversationId) => {
  return state.getIn(['entities', 'conversations', conversationId]);
};

const agendaItemsForOrganization = (state, organizationId) => {
  const references = state.getIn(['agendaItemsByOrganization', organizationId, 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    return fillConversationObject(state, reference);
  }).toList().filter((agendaItem) => {
    return !agendaItem.archived;
  }).sortBy((conversationObject) => {
    return conversationObject.createdAt;
  });
};

const agendaItemIdsForConversation = (state, conversationId) => {
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', conversationId]);

  if (!agendaItemIdsToShow) {
    return new Immutable.List();
  }

  return agendaItemIdsToShow.get('references');
};

const deliverableReferencesForAgendaItem = (state, agendaItemId) => {
  const deliverableReferences = state.getIn(['deliverablesByAgendaItem', agendaItemId]);
  if (!deliverableReferences) {
    return new Immutable.List();
  }

  return deliverableReferences.get('references');
};

const deliverablesForAgendaItem = (state, agendaItemId) => {
  const deliverableReferences = deliverableReferencesForAgendaItem(state, agendaItemId);
  return deliverableReferences.map((ref) => {
    return fillConversationObject(state, ref);
  }).filter((deliverable) => {
    return (deliverable.agendaItem && !deliverable.agendaItem.archived) && !deliverable.archived;
  }).toList().sortBy((deliverable) => {
    return deliverable.dueOn ? 'A' + deliverable.dueOn : 'B' + deliverable.createdAt;
  });
};

const deliverablesForConversation = (state, conversationId) => {
  const agendaItemIds = agendaItemIdsForConversation(state, conversationId).map(agendaItem => agendaItem.id);
  return agendaItemIds.map((agendaItemId) => {
    return deliverablesForAgendaItem(state, agendaItemId);
  }).flatten().filter((deliverable) => {
    return (deliverable.agendaItem && !deliverable.agendaItem.archived) && !deliverable.archived;
  }).toList().sortBy((deliverable) => {
    return deliverable.dueOn ? 'A' + deliverable.dueOn : 'B' + deliverable.createdAt;
  });
};

const deliverablesForOrganization = (state, organizationId) => {
  const references = state.getIn(['deliverablesByOrganization', organizationId, 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    return fillConversationObject(state, reference);
  }).sortBy((deliverable) => {
    return deliverable.dueOn ? 'A' + deliverable.dueOn : 'B' + deliverable.createdAt;
  });
};

const conversationsForOrganization = (state, organizationId) => {
  const references = state.getIn(['conversationsByOrganization', organizationId, 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    return fillConversationObject(state, reference);
  }).toList().sortBy((conv) => {
    return conv.title;
  });
};
const users = (state) => state.getIn(['entities', 'users']).toList();

const currentUser = (state) => state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
const currentConversation = (state) => state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
const currentOrganization = (state) => {
  const currentOrgId = state.getIn(['currentOrganization', 'id']);
  if (!currentOrgId) {
    return null;
  }
  return state.getIn(['entities', 'organizations', currentOrgId]);
};
const organizations = (state) => state.getIn(['entities', 'organizations']).map((organization) => { return organization; }).toList();

const organizationMembers = (state) => {
  const references = state.getIn(['entities', 'organizationMembers']);
  const currentOrg = currentOrganization(state);
  if (!references || !currentOrg) {
    return null;
  }

  const filteredOrganizationMembers = references.filter((reference) => {
    return (reference.organizationId === currentOrg.id);
  });

  return filteredOrganizationMembers.map((reference) => {
    return state.getIn(['entities', 'users', reference.memberId]);
  });
};

const conversationMembers = (state) => {
  const references = state.getIn(['conversationMembersByConversation', state.getIn(['currentConversation', 'id']), 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    return state.getIn(['entities', 'conversationMembers', reference.id]);
  });
};

const conversationMembersAsUsers = (state, conversationId) => {
  const references = state.getIn(['conversationMembersByConversation', conversationId, 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    const conversationMember = state.getIn(['entities', 'conversationMembers', reference.id]);
    return state.getIn(['entities', 'users', conversationMember.memberId]);
  });
};

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

const agendaItemsList = (state, conversationId) => {
  const agendaItemIds = agendaItemIdsForConversation(state, conversationId);

  return agendaItemIds.map((ref) => {
    return state.getIn(['entities', 'agendaItems', ref.id]);
  }).toList().map((agendaItem) => {
    return fillAgendaItem(state, agendaItem.id);
  }).filter((agendaItem) => {
    return !agendaItem.archived;
  }).sortBy((conversationObject) => {
    return conversationObject.createdAt;
  });
};

export {
  users,
  currentUser,
  currentConversation,
  currentOrganization,
  organizations,
  conversationMembers,
  organizationMembers,
  conversationObjects,
  agendaItemsList,
  conversationMembersAsUsers,
  agendaItemsForOrganization,
  deliverablesForOrganization,
  deliverablesForConversation,
  deliverablesForAgendaItem,
  conversationsForOrganization,
  organization,
  conversation,
};
