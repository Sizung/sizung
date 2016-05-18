// These are the actions relevant to attachments
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import { routeActions } from 'redux-simple-router';
import * as constants from './constants';
import * as transform from '../utils/jsonApiUtils';
import * as api from '../utils/api';

const createAttachment = (parentType, parentId, values) => {
  return (dispatch) => {
    api.postJson('/api/' + (parentType === 'agendaItems' ? 'agenda_items' : parentType) + '/' + parentId + '/attachments', { attachment: values }, (json) => {
      const attachment = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.CREATE_ATTACHMENT,
        status: constants.STATUS_SUCCESS,
        attachment,
        entity: attachment,
      });
    });
  };
};

export {
  createAttachment,
};
