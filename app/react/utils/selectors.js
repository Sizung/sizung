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

const deliverableReferencesForConversation = (state, conversationId) => {
  const deliverableReferences = state.getIn(['deliverablesByConversation', conversationId]);
  if (!deliverableReferences) {
    return new Immutable.List();
  }

  return deliverableReferences.get('references');
};

const sortDeliverables = (deliverablesList) => {
  return deliverablesList.filter((deliverable) => {
    return (deliverable.status === 'open');
  }).sortBy((deliverable) => {
    return deliverable.dueOn ? 'A' + deliverable.dueOn + deliverable.createdAt : 'B' + deliverable.createdAt;
  }).concat(deliverablesList.filter((deliverable) => {
    return (deliverable.status === 'resolved');
  }).sortBy((deliverable) => {
    return deliverable.createdAt;
  }));
};

const deliverablesForAgendaItem = (state, agendaItemId) => {
  const deliverableReferences = deliverableReferencesForAgendaItem(state, agendaItemId);
  let deliverablesList = deliverableReferences.map((ref) => {
    return fillConversationObject(state, ref);
  }).filter((deliverable) => {
    return (deliverable.parent && !deliverable.parent.archived) && !deliverable.archived;
  }).toList();

  return sortDeliverables(deliverablesList);
};

const deliverablesForConversationOnly = (state, conversationId) => {
  const conversationDeliverableList = deliverableReferencesForConversation(state, conversationId).map((ref) => {
    return fillConversationObject(state, ref);
  }).filter((deliverable) => {
    return (deliverable.parent && !deliverable.parent.archived) && !deliverable.archived;
  }).toList();

  return sortDeliverables(conversationDeliverableList);
}

const deliverablesForConversation = (state, conversationId) => {
  const conversationDeliverableList = deliverablesForConversationOnly(state, conversationId);

  const agendaItemIds = agendaItemIdsForConversation(state, conversationId).map(agendaItem => agendaItem.id);
  let deliverablesList = agendaItemIds.map((agendaItemId) => {
    return deliverablesForAgendaItem(state, agendaItemId);
  }).flatten().filter((deliverable) => {
    return (deliverable.parent && !deliverable.parent.archived) && !deliverable.archived;
  }).toList().concat(conversationDeliverableList);

  return sortDeliverables(deliverablesList);
};

const deliverablesForOrganization = (state, organizationId) => {
  const references = state.getIn(['deliverablesByOrganization', organizationId, 'references']);
  if (!references) {
    return null;
  }

  let deliverablesList = references.map((reference) => {
    return fillConversationObject(state, reference);
  });

  return sortDeliverables(deliverablesList);
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

const user = (state, id) => state.getIn(['entities', 'users', id]);

const users = (state) => state.getIn(['entities', 'users']).toList();

const currentUser = (state) => user(state, state.getIn(['currentUser', 'id']));

const currentConversation = (state) => state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);

const currentOrganization = (state) => {
  const currentOrgId = state.getIn(['currentOrganization', 'id']);
  if (!currentOrgId) {
    return null;
  }
  return state.getIn(['entities', 'organizations', currentOrgId]);
};

const organizations = (state) => state.getIn(['entities', 'organizations']).map((organization) => { return organization; }).toList();


const organizationMembers = (state, organizationId) => {
  const references = state.getIn(['entities', 'organizationMembers']);
  if (!references) {
    return null;
  }

  const filteredOrganizationMembers = references.filter((reference) => {
    return (reference.organizationId === organizationId);
  });

  return filteredOrganizationMembers.map((reference) => {
    return state.getIn(['entities', 'users', reference.memberId]);
  });
};

const currentOrganizationMembers = (state) => {
  const currentOrg = currentOrganization(state);
  if (!currentOrg) {
    return null;
  }

  return organizationMembers(state, currentOrg.id);
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
    if (!conversationMember) {
      console.warn(`ConversationMember Entitiy not found for ConversationMember with id: ${reference.id}`);
    }
    const user = state.getIn(['entities', 'users', conversationMember.memberId]);
    if (!user) {
      console.warn(`User entity not found for id: ${conversationMember.memberId}`);
    }
    return user;
  }).filter((user) => {
    return !!user;
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
  let agendaItemsList = agendaItemIds.map((ref) => {
    return state.getIn(['entities', 'agendaItems', ref.id]);
  }).toList().map((agendaItem) => {
    return fillAgendaItem(state, agendaItem.id);
  });

  agendaItemsList = agendaItemsList.filter((agendaItem) => {
    return (!agendaItem.archived && agendaItem.status === 'open');
  }).sortBy((conversationObject) => {
    return conversationObject.createdAt;
  }).concat(agendaItemsList.filter((agendaItem) => {
    return (!agendaItem.archived && agendaItem.status === 'resolved');
  }).sortBy((conversationObject) => {
    return conversationObject.createdAt;
  }));
  return agendaItemsList;
};

const conversationSettingsViewState = (state) => {
  return state.getIn(['conversationUi', 'conversationSettingsState']);
};

export {
  user,
  users,
  currentUser,
  currentConversation,
  currentOrganization,
  organizations,
  conversationMembers,
  organizationMembers,
  currentOrganizationMembers,
  conversationObjects,
  agendaItemsList,
  conversationMembersAsUsers,
  agendaItemsForOrganization,
  deliverablesForOrganization,
  deliverablesForConversation,
  deliverablesForConversationOnly,
  deliverablesForAgendaItem,
  conversationsForOrganization,
  organization,
  conversation,
  conversationSettingsViewState,
};
