import * as constants from './constants';

const setCurrentUser = (currentUserReference) => {
  return {
    type: constants.SET_CURRENT_USER,
    status: constants.STATUS_SUCCESS,
    currentUser: currentUserReference,
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

export {
  setCurrentUser,
  setUsers,
  updateUserRemoteOrigin,
};
