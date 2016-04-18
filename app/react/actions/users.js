import * as constants from './constants';
import * as transform from '../utils/jsonApiUtils';
import * as api from '../utils/api';
import * as ConversationUiActions from './conversationUi';

const setCurrentUser = (currentUserReference) => {
  return (dispatch) => {
    dispatch({
      type: constants.SET_CURRENT_USER,
      status: constants.STATUS_SUCCESS,
      currentUser: currentUserReference,
    });
    dispatch(ConversationUiActions.resetConversationUi());
  };
};

const setUsers = (users) => {
  return {
    type: constants.SET_USERS,
    status: constants.STATUS_SUCCESS,
    users,
    entities: users,
  };
};

const updateUserRemoteOrigin = (user) => {
  return {
    type: constants.UPDATE_USER,
    status: constants.STATUS_REMOTE_ORIGIN,
    user,
    entity: user,
  };
};

const updateUser = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/users/' + id, { user: changedFields }, (json) => {
      const user = transform.transformObjectFromJsonApi(json.data);
      dispatch(updateUserRemoteOrigin(user));
      alert('User Profile updated successfully!');
    });
  };
};

export {
  setCurrentUser,
  setUsers,
  updateUserRemoteOrigin,
  updateUser,
};
