import Immutable from 'immutable';

const initialMap = Immutable.Map({
  isFetching: false,
  nextPageUrl: undefined,
  pageCount: 0,
  references: new Immutable.Set(),
});

function currentMap(state, key) {
  let map = state.get(key);
  if (!map) {
    map = initialMap;
  }
  return map;
}

const Reference = Immutable.Record({ id: null, type: null });

export function toReference(object) {
  return new Reference({ id: object.id, type: object.type });
}

export function fetchInProgress(state, key) {
  const map = currentMap(state, key);
  return state.set(key, map.set('isFetching', true));
}

export function fetched(state, key, references, action) {
  const map = currentMap(state, key);
  let newSet = map.get('references');
  references.forEach(reference => {
    newSet = newSet.add(reference);
  });

  return state.set(key,
    map
      .set('references', newSet)
      .set('nextPageUrl', action.links ? action.links.next : null)
      .set('isFetching', false)
  );
}

export function fetchedReset(state, key, references, action) {
  const map = currentMap(state, key);
  let newSet = new Immutable.Set();
  references.forEach(reference => {
    newSet = newSet.add(reference);
  });

  return state.set(key,
    map
      .set('references', newSet)
      .set('nextPageUrl', action.links ? action.links.next : null)
      .set('isFetching', false)
  );
}

export function init(state, key) {
  return state.set(key, initialMap);
}

export function add(state, key, reference) {
  let map = currentMap(state, key);
  map = map.set('references', map.get('references').add(reference));
  return state.set(key, map);
}

export function update(state, key, reference) {
  const ensuredMap = currentMap(state, key);
  const newState = state.set(key, ensuredMap);
  return newState.map((map, k) => {
    if (k === key) {
      return map.set('references', map.get('references').add(reference));
    }

    return map.set('references', map.get('references').filter(ref => {
      return ref.id !== reference.id;
    }));
  });
}

export function remove(state, key, reference) {
  const map = currentMap(state, key);
  const newMap = map.set('references', map.get('references').filter((refObject) => { return refObject.id !== reference.id; }));
  return state.set(key, newMap);
}