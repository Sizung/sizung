import 'babel-core/polyfill';
window.React = require('react');
window.ReactDOM = require('react-dom');

import ComposeContainer from './components/ComposeContainer';
registerComponent('ComposeContainer', ComposeContainer);

import Root from './containers/Root.js';
registerComponent('Root', Root);

import User from './components/User';
registerComponent('User', User);

import EditableAgendaItem from './components/EditableAgendaItem';
registerComponent('EditableAgendaItem', EditableAgendaItem);

import UnseenBadge from './components/UnseenBadge';
registerComponent('UnseenBadge', UnseenBadge);

import TopBar from './components/TopBar';
registerComponent('TopBar', TopBar);

import SignUp from './components/SignUp';
registerComponent('SignUp', SignUp);
