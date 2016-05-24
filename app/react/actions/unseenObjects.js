import * as constants from './constants';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';

const markAsSeen = (seenType, seenId) => {
  const type = seenType === 'agendaItems' ? 'agenda_items' : seenType;

  return (dispatch) => {
    api.deleteJson('/api/' + type + '/' + seenId + '/unseen_objects', (json) => {
      const unseenObjects = json.data.map(transform.transformObjectFromJsonApi);
      dispatch({
        type: constants.DELETE_UNSEEN_OBJECTS,
        verb: constants.DELETE,
        status: constants.STATUS_SUCCESS,
        entities: unseenObjects,
      });
    });
  };
};

const setUnseenObjects = (unseenObjects) => {
  return {
    type: constants.SET_UNSEEN_OBJECTS,
    status: constants.STATUS_REMOTE_ORIGIN,
    entities: unseenObjects,
  };
};

const fetchUnseenObjects = (type, id) => {
  return (dispatch) => {
    console.log('fetching unseen objects for: ', type, id);
    api.fetchJson('/api/' + type + '/' + id + '/unseen_objects', (json) => {
      dispatch(setUnseenObjects(json.data.map(transform.transformUnseenObjectFromJsonApi)));
    });
  };
};

const createUnseenObjectRemoteOrigin = (unseenObject) => {
  return {
    type: constants.CREATE_UNSEEN_OBJECT,
    status: constants.STATUS_REMOTE_ORIGIN,
    entity: unseenObject,
  };
};

const deleteUnseenObjectRemoteOrigin = (unseenObject) => {
  return {
    type: constants.DELETE_UNSEEN_OBJECTS,
    verb: constants.DELETE,
    status: constants.STATUS_REMOTE_ORIGIN,
    entity: unseenObject,
  };
};

export {
  markAsSeen,
  createUnseenObjectRemoteOrigin,
  deleteUnseenObjectRemoteOrigin,
  fetchUnseenObjects,
};
