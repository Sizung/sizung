/* Tries to find the conversation id from an AgendaItem, Deliverable or Conversation */
const getConversationIdFrom = (obj) => {
  switch(obj.type) {
    case 'conversations':
      return obj.id;
    case 'agendaItems':
      return obj.conversationId;
    case 'deliverables':
      return obj.parentType == 'agendaItems' ? obj.parent.conversationId : obj.parentId;
    default:
      throw new Error(`getConversationIdFrom does not support parentType for deliverable: ${JSON.stringify(deliverable)}`);
  }
}

const getConversationIdFromParent = (parent) => {
  if (parent.type === 'conversations') {
    return parent.id;
  } else if (parent.type === 'agendaItems') {
    return parent.conversationId;
  } else if (parent.type === 'deliverables') {
    return parent.parent.conversationId;
  } else {
    throw new Error(`getConversationIdFromParent does not support parent: ${JSON.stringify(parent)}`);
  }
}

export {
  getConversationIdFrom,
  getConversationIdFromParent,
}
