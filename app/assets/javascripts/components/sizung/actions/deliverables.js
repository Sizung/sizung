// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

export const SET_DELIVERABLES = 'SET_DELIVERABLES';

export function setDeliverables(deliverables) {
  return {
    type: SET_DELIVERABLES,
      deliverables: deliverables

};
}

