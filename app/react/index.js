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