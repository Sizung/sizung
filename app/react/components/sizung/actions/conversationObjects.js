import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';
import { transformConversationObjectFromJsonApi } from '../utils/jsonApiUtils.js';

export const SET_CONVERSATION_OBJECTS = 'SET_CONVERSATION_OBJECTS';
export const FETCH_CONVERSATION_OBJECTS = 'FETCH_CONVERSATION_OBJECTS';

export function setConversationObjects(conversation, conversationObjects) {
  return {
    type: SET_CONVERSATION_OBJECTS,
    conversation: conversation,
    conversationObjects: conversationObjects.data.map(transformConversationObjectFromJsonApi)
  };
}

function fetchConversationObjectsSuccess(parentReference, conversationObjects, links) {
  return {
    type: FETCH_CONVERSATION_OBJECTS,
    status: STATUS_SUCCESS,
    parentReference: parentReference,
    conversationObjects: conversationObjects,
    links: links
  };
}

export function fetchConversationObjects(type, id, url = null) {
  const urlToFetch = url || '/' + type + '/' + id + '/conversation_objects';

  return function(dispatch) {
    return fetch(urlToFetch, {
      method: 'get',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      }
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(fetchConversationObjectsSuccess(
        { type: type, id: id },
        json.data.map(transformConversationObjectFromJsonApi),
        json.links
      ));
    });
  };

}