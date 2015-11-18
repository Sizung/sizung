import Immutable from 'immutable';

const initialMap = Immutable.Map({
  isFetching: false,
  nextPageUrl: undefined,
  pageCount: 0,
  references: Immutable.Set()
});

export function toReference(object) {
  return { id: object.id, type: object.type };
}

export function fetchInProgress(state, key) {
  const map = currentMap(state, key);
  return state.set(key, map.set('isFetching', true));
}

export function fetched(state, key, references, action) {
  const map = currentMap(state, key);
  var newSet = map.get('references');
  references.forEach(reference => {
    newSet = newSet.add(reference)
  });

  return state.set(key,
    map
      .set('references', newSet)
      .set('nextPageUrl', action.links.next)
      .set('isFetching', false)
  );
}

export function add(state, key, reference) {
  const map = currentMap(state, key);
  const newMap = map.set('references', map.get('references').add(reference));
  return state.set(key, newMap);
}

export function remove(state, key, reference) {
  const map = currentMap(state, key);
  const newMap = map.set('references', map.get('references').filter(function(refObject) { return refObject.id != reference.id }));
  return state.set(key, newMap);
}

function currentMap(state, key) {
  var currentMap = state.get(key);
  if(currentMap == null) {
    currentMap = initialMap;
  }
  return currentMap;
}
