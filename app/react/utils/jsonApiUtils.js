function transformTypeFromJsonApi(type) {
  switch(type) {
    case 'agenda_items': return 'agendaItems';
    case 'unseen_objects': return 'unseenObjects';
    default: return type
  }
}

function relId(obj, name) {
  return obj.relationships[name].data ? obj.relationships[name].data.id : null;
}

export function transformUnseenObjectFromJsonApi(obj) {
  return {
    id: obj.id,
    type: transformTypeFromJsonApi(obj.type),
    userId: relId(obj, 'user'),
    targetId: relId(obj, 'target'),
    deliverableId: relId(obj, 'deliverable'),
    agendaItemId: relId(obj, 'agenda_item'),
    conversationId: relId(obj, 'conversation'),
    organizationId: relId(obj, 'organization')
  }
}

export function transformOrganizationFromJsonApi(organization) {
  return {
    id: organization.id,
    type: transformTypeFromJsonApi(organization.type),
    name: organization.attributes.name
  };
}

export function transformConversationFromJsonApi(conversation) {
  return {
    id: conversation.id,
    type: transformTypeFromJsonApi(conversation.type),
    title: conversation.attributes.title,
    organization_id: conversation.relationships.organization.data.id,
    organizationId: conversation.relationships.organization.data.id,
    created_at: conversation.created_at,
    updated_at: conversation.updated_at,
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
    archived: deliverable.attributes.archived,
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
    archived: agendaItem.attributes.archived,
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
    type: 'users',
    email: user.attributes.email,
    firstName: user.attributes.first_name,
    lastName: user.attributes.last_name,
    name: user.attributes.first_name + user.attributes.last_name,
    presenceStatus: user.attributes.presence_status,
  };
}

export function transformConversationMemberFromJsonApi(conversationMember) {
  return {
    id: conversationMember.id,
    type: 'conversationMembers',
    conversationId: conversationMember.relationships.conversation.data.id,
    memberId: conversationMember.relationships.member.data.id
  }
}

export function transformOrganizationMemberFromJsonApi(orgMember) {
  return {
    id: orgMember.id,
    type: 'organizationMembers',
    organizationId: orgMember.relationships.organization.data.id,
    memberId: orgMember.relationships.member.data.id,
  };
}

const transformObjectFromJsonApi = (obj) => {
  switch (obj.type) {
    case 'users': return transformUserFromJsonApi(obj);
    case 'comments': return transformCommentFromJsonApi(obj);
    case 'conversations': return transformConversationFromJsonApi(obj);
    case 'agenda_items': return transformAgendaItemFromJsonApi(obj);
    case 'deliverables': return transformDeliverableFromJsonApi(obj);
    case 'unseen_objects': return transformUnseenObjectFromJsonApi(obj);
    case 'conversation_members': return transformConversationMemberFromJsonApi(obj);
    case 'organization_members': return transformOrganizationMemberFromJsonApi(obj);
    case 'organizations': return transformOrganizationFromJsonApi(obj);
    default: console.warn('Unknown type of Object to transform: ', obj);
  }
};

export {
  transformObjectFromJsonApi,
};

export function transformConversationObjectFromJsonApi(conversationObject) {
  return transformObjectFromJsonApi(conversationObject);
}
