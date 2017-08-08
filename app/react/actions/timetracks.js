// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import * as api from '../utils/api';
import * as constants from './constants';

const updateTimeTrack = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/time_tracks/' + id, { time_track: changedFields }, () => {
      dispatch({
        type: constants.UPDATE_TIME_TRACK,
        status: constants.STATUS_SUCCESS,
      });
    });
  };
};

const createTimeTrack = (values) => {
  return (dispatch) => {
    api.postJson('/api/time_tracks', { time_track: values }, () => {
      dispatch({
        type: constants.CREATE_TIME_TRACK,
        status: constants.STATUS_SUCCESS,
      });
    });
  };
};

export {
  createTimeTrack,
  updateTimeTrack,
};
