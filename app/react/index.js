import 'babel-core/polyfill';
window.React = require('react');

import CommentForm from './components/CommentForm/index.js';
registerComponent('CommentForm', CommentForm);

import ConversationRoot from './containers/ConversationRoot.js';
registerComponent('ConversationRoot', ConversationRoot);

import User from './components/User/index.js';
registerComponent('User', User);

import EditableAgendaItem from './components/EditableAgendaItem/index.js';
registerComponent('EditableAgendaItem', EditableAgendaItem);

import UnseenBadge from './components/UnseenBadge/index.js';
registerComponent('UnseenBadge', UnseenBadge);