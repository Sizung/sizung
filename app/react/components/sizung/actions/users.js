export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_USERS = 'SET_USERS';

export function setCurrentUser(currentUser) {
  return {
    type: SET_CURRENT_USER,
    currentUser: currentUser
  };
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    users: users
  };
}
