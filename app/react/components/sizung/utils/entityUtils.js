export function fillAgendaItem(state, id) {
  var agendaItem = state.getIn(['entities', 'agendaItems', id]);
  agendaItem.conversation = state.getIn(['entities', 'conversations', agendaItem.conversationId]);
  agendaItem.owner = state.getIn(['entities', 'users', agendaItem.ownerId]);

  return agendaItem;
}

export function fillComment(state, id) {
  var comment = state.getIn(['entities', 'comments', id]);
  comment.author = state.getIn(['entities', 'users', comment.authorId]);

  return comment;
}

export function fillConversationObject(state, {id, type}) {
  if(type === 'agendaItems') {
    return fillAgendaItem(state, id);
  }
  else if(type === 'comments') {
    return fillComment(state, id);
  }
}