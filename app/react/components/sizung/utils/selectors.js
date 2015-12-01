export function conversationMembers(state) {
  return state.getIn(['entities','users']);
}