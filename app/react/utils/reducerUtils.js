import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { toReference, fetched, fetchInProgress, add, update, remove } from '../utils/paginationUtils';

export function setObject(state, action, objectName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return state.set(action[objectName].id, action[objectName]);
  }
  else {
    return state;
  }
}

export function deleteObject(state, action, objectName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return state.remove(action[objectName].id);
  }
  else {
    return state;
  }
}

export function setObjects(state, action, objectListName) {
  for(var i=0; i<action[objectListName].length; i++) {
    state = state.set(action[objectListName][i].id, action[objectListName][i]);
  }
  return state;
}

export function setReference(state, action, objectName, referenceName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return add(state, action[objectName][referenceName], toReference(action[objectName]));
  }
  else {
    return state;
  }
}

export function updateReference(state, action, objectName, referenceName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return update(state, action[objectName][referenceName], toReference(action[objectName]));
  }
  else {
    return state;
  }
}

export function setCommentReference(state, action, commentableType) {
  if((action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) && action.comment.commentableType == commentableType) {
    return add(state, action.comment.commentableId, toReference(action.comment));
  }
  else {
    return state;
  }
}

export function deleteCommentReference(state, action, commentableType) {
  if((action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) && action.comment.commentableType == commentableType) {
    return remove(state, action.comment.commentableId, toReference(action.comment));
  }
  else {
    return state;
  }
}

export function handleFetchConversationObjects(state, action, parentReferenceType) {
  if(action.parentReference.type === parentReferenceType) {
    if (action.status == STATUS_SUCCESS) {
      const objects = action.conversationObjects.map(toReference);
      return fetched(state, action.parentReference.id, objects, action);
    } else {
      return fetchInProgress(state, action.parentReference.id);
    }
  }
  else {
    return state;
  }
}

export function setObjectsFrom(state, action, list, objectType) {
  var newState = state;
  if (action.status === STATUS_SUCCESS) {
    list.forEach((obj) => {
      if (obj.type === objectType) {
        newState = newState.set(obj.id, obj);
      }
    });
    return newState;
  };

  return state;
}

export function setObjectsFromConversationObjectsList(state, action, objectType) {
  if (action.status == STATUS_SUCCESS) {
    action.conversationObjects.forEach(conversationObject => {
      if (conversationObject.type === objectType) {
        state = state.set(conversationObject.id, conversationObject);
      }
    });
    return state;
  }
  else {
    return state;
  }
}