import 'babel-core/polyfill';
window.React = require('react');

//import HelloWorld from './components/hello-world';
//
//registerComponent('hello-world', HelloWorld);

import CommentForm from './components/sizung/components/CommentForm/index.js'
registerComponent('CommentForm', CommentForm);

import ConversationRoot from './components/sizung/containers/ConversationRoot.js'
registerComponent('ConversationRoot', ConversationRoot);

import User from './components/sizung/components/User/index.js'
registerComponent('User', User);

import EditableAgendaItem from './components/sizung/components/EditableAgendaItem/index.js'
registerComponent('EditableAgendaItem', EditableAgendaItem);

import UnseenBadge from './components/sizung/components/UnseenBadge/index.js'
registerComponent('UnseenBadge', UnseenBadge);