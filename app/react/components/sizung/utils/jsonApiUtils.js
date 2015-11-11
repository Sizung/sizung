function transformTypeFromJsonApi(type) {
  switch(type) {
    case 'agenda_items': return 'agendaItems';
    default: return type
  }
}

export function transformAgendaItemFromJsonApi(agendaItem) {
  return {
    id: agendaItem.id,
    type: transformTypeFromJsonApi(agendaItem.type),
    title: agendaItem.attributes.title,
    ownerId: agendaItem.relationships.owner.data.id,
    conversationId: agendaItem.relationships.conversation.data.id,
    commentsCount: agendaItem.attributes.comments_count,
    createdAt: agendaItem.attributes.created_at,
    updatedAt: agendaItem.attributes.updated_at
  };
}

export function transformCommentFromJsonApi(comment) {
  return {
    id: comment.id,
    type: comment.type,
    body: comment.attributes.body,
    createdAt: comment.attributes.created_at,
    updatedAt: comment.attributes.updated_at,
    authorId: comment.relationships.author.data.id,
    commentableId: comment.relationships.commentable.data.id,
    commentableType: transformTypeFromJsonApi(comment.relationships.commentable.data.type)
  };
}

export function transformUserFromJsonApi(user) {
  return {
    id: user.id,
    type: user.type,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    name: user.first_name + user.last_name,
    presenceStatus: user.presence_status
  };
}

export function transformConversationObjectFromJsonApi(conversationObject) {
  if (conversationObject.type === 'comments') {
    return transformCommentFromJsonApi(conversationObject);
  }
  else if  (conversationObject.type === 'agenda_items') {
    return transformAgendaItemFromJsonApi(conversationObject);
  }
  else {
    console.log('Unknown type of ConversationObject to transform: ', conversationObject);
  }
}
