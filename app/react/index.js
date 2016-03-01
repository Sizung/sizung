import 'babel-core/polyfill';
window.React = require('react');
window.ReactDOM = require('react-dom');

import CommentForm from './components/CommentForm/index.js';
registerComponent('CommentForm', CommentForm);

import Root from './containers/Root.js';
registerComponent('Root', Root);

import User from './components/User/index.js';
registerComponent('User', User);

import EditableAgendaItem from './components/EditableAgendaItem/index.js';
registerComponent('EditableAgendaItem', EditableAgendaItem);

import UnseenBadge from './components/UnseenBadge/index.js';
registerComponent('UnseenBadge', UnseenBadge);

import TopBar from './components/TopBar/index.js';
registerComponent('TopBar', TopBar);
