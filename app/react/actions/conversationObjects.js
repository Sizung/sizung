import * as api from '../utils/api';
import * as constants from './constants';
import * as transform from '../utils/jsonApiUtils';

const fetchConversationObjectsInProgress = (parentReference) => {
  return {
    type: constants.FETCH_CONVERSATION_OBJECTS,
    status: constants.STATUS_IN_PROGRESS,
    parentReference,
  };
};

const fetchConversationObjects = (type, id, url = null) => {
  const urlToFetch = url || '/' + type + '/' + id + '/conversation_objects';
  const parentReference = { type, id };

  return (dispatch) => {
    dispatch(fetchConversationObjectsInProgress(parentReference));

    api.fetchJson(urlToFetch, (json) => {
      const conversationObjects = json.data.map(transform.transformObjectFromJsonApi);

      dispatch({
        type: constants.FETCH_CONVERSATION_OBJECTS,
        status: constants.STATUS_SUCCESS,
        parentReference,
        conversationObjects,
        links: json.links,
        entities: conversationObjects,
      });
    });
  };
};

export {
  fetchConversationObjects,
};
