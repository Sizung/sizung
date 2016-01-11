import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';

const fetchJson = (path, successJsonCallback) => {
  return fetch(path, {
    method: 'get',
    credentials: 'include', // send cookies with it
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
    },
  })
  .then((response) => response.json())
  .then((json) => {
    successJsonCallback(json);
  });
};

export {
  fetchJson,
};
