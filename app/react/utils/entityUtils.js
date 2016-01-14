import Immutable from 'immutable';

export function fillDeliverable(state, id) {
  var deliverable = Immutable.fromJS(state.getIn(['entities', 'deliverables', id])).toJS();
  deliverable.agendaItem = fillAgendaItem(state, deliverable.agendaItemId);
  deliverable.owner = state.getIn(['entities', 'users', deliverable.ownerId]);
  deliverable.assignee = state.getIn(['entities', 'users', deliverable.assigneeId]);
  deliverable.unseen = state.getIn(['entities', 'unseenObjects']).some((unseenObject) => {
    return unseenObject.targetId === id;
  });
  deliverable.unseenCount = state.getIn(['entities', 'unseenObjects']).filter((unseenObject) => {
    return unseenObject.deliverableId === id;
  }).size;

  return deliverable;
}

export function fillAgendaItem(state, id) {
  const agendaItem = Immutable.fromJS(state.getIn(['entities', 'agendaItems', id])).toJS();
  agendaItem.conversation = state.getIn(['entities', 'conversations', agendaItem.conversationId]);
  agendaItem.owner = state.getIn(['entities', 'users', agendaItem.ownerId]);
  agendaItem.unseen = state.getIn(['entities', 'unseenObjects']).some((unseenObject) => {
    return unseenObject.targetId === id;
  });
  agendaItem.unseenCount = state.getIn(['entities', 'unseenObjects']).filter((unseenObject) => {
    return unseenObject.agendaItemId === id;
  }).size;

  return agendaItem;
}

export function fillComment(state, id) {
  var comment = Immutable.fromJS(state.getIn(['entities', 'comments', id])).toJS();
  comment.author = state.getIn(['entities', 'users', comment.authorId]);
  comment.unseen = state.getIn(['entities', 'unseenObjects']).some((unseenObject) => {
    return unseenObject.targetId === id;
  });

  return comment;
}

export function fillConversationObject(state, {id, type}) {
  if(type === 'agendaItems') {
    return fillAgendaItem(state, id);
  }
  else if(type === 'comments') {
    return fillComment(state, id);
  }
  else if(type === 'deliverables') {
    return fillDeliverable(state, id);
  }
  else {
    console.warn('Unknown ConversationObject to fill: ', id, type);
  }
}