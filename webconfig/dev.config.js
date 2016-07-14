const WebpackNotifierPlugin = require('webpack-notifier');
const config = require('./production.config');

config.plugins.push(new WebpackNotifierPlugin());

module.exports = config;
