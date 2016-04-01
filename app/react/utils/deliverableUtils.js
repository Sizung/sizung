const getConversationIdFromParent = (parent) => {
  if (parent.type === 'conversations') {
    return parent.id;
  } else if (parent.type === 'agendaItems') {
    return parent.conversationId;
  } else if (parent.type === 'deliverables') {
    return parent.parent.conversationId;
  } else {
    console.warn(`getConversationIdFromParent does not support parent: ${parent}`);
    throw `getConversationIdFromParent does not support parent: ${parent}`;
  }
}

export {
  getConversationIdFromParent,
}
