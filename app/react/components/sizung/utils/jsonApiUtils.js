function transformTypeFromJsonApi(type) {
  switch(type) {
    case 'agenda_items': return 'agendaItems';
    default: return type
  }
}

export function transformOrganizationFromJsonApi(organization) {
  return {
    id: organization.id,
    type: transformTypeFromJsonApi(organization.type),
    name: organization.attributes.name
  };
}

export function transformDeliverableFromJsonApi(deliverable) {
  return {
    id: deliverable.id,
    type: transformTypeFromJsonApi(deliverable.type),
    title: deliverable.attributes.title,
    status: deliverable.attributes.status,
    dueOn: deliverable.attributes.due_on,
    ownerId: deliverable.relationships.owner.data.id,
    assigneeId: deliverable.relationships.assignee.data.id,
    agendaItemId: deliverable.relationships.agenda_item.data.id,
    commentsCount: deliverable.attributes.comments_count,
    createdAt: deliverable.attributes.created_at,
    updatedAt: deliverable.attributes.updated_at
  };
}

export function transformAgendaItemFromJsonApi(agendaItem) {
  return {
    id: agendaItem.id,
    type: transformTypeFromJsonApi(agendaItem.type),
    title: agendaItem.attributes.title,
    status: agendaItem.attributes.status,
    ownerId: agendaItem.relationships.owner.data.id,
    conversationId: agendaItem.relationships.conversation.data.id,
    commentsCount: agendaItem.attributes.comments_count,
    deliverablesCount: agendaItem.attributes.deliverables_count,
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
  else if  (conversationObject.type === 'deliverables') {
    return transformDeliverableFromJsonApi(conversationObject);
  }
  else {
    console.warn('Unknown type of ConversationObject to transform: ', conversationObject);
  }
}
