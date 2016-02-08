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

const writeJson = (method, path, body, successJsonCallback) => {
  return fetch(path, {
    method,
    credentials: 'include', // send cookies with it
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
    },
    body: JSON.stringify(body),
  })
  .then((response) => response.json())
  .then((json) => {
    successJsonCallback(json);
  });
};

const postJson = (path, body, successJsonCallback) => {
  return writeJson('post', path, body, successJsonCallback);
};

const putJson = (path, body, successJsonCallback) => {
  return writeJson('put', path, body, successJsonCallback);
};

const deleteJson = (path, successJsonCallback) => {
  return fetch(path, {
    method: 'delete',
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
  postJson,
  putJson,
  deleteJson,
};
