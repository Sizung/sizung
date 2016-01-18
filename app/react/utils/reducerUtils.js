import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { toReference, fetched, fetchInProgress, init, add, update, remove } from '../utils/paginationUtils';

export function initReferences(state, reference) {
  return init(state, reference);
}

export function setReferenceByObject(state, object, reference) {
  return add(state, reference, toReference(object));
}

export function setReference(state, action, objectName, referenceName) {
  if (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) {
    return add(state, action[objectName][referenceName], toReference(action[objectName]));
  }

  return state;
}

export function removeReference(state, action, objectName, referenceName) {
  if ((action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN)) {
    return remove(state, action[objectName][referenceName], toReference(action[objectName]));
  }
  return state;
}

export function updateReference(state, action, objectName, referenceName) {
  if (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) {
    return update(state, action[objectName][referenceName], toReference(action[objectName]));
  }
  return state;
}

export function setCommentReference(state, action, commentableType) {
  if ((action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) && action.comment.commentableType === commentableType) {
    return add(state, action.comment.commentableId, toReference(action.comment));
  }
  return state;
}

export function deleteCommentReference(state, action, commentableType) {
  if ((action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) && action.comment.commentableType === commentableType) {
    return remove(state, action.comment.commentableId, toReference(action.comment));
  }
  return state;
}

export function handleFetchConversationObjects(state, action, parentReferenceType) {
  if (action.parentReference.type === parentReferenceType) {
    if (action.status === STATUS_SUCCESS) {
      const objects = action.conversationObjects.map(toReference);
      return fetched(state, action.parentReference.id, objects, action);
    }
    return fetchInProgress(state, action.parentReference.id);
  }
  return state;
}
