#= require cable

@App = {}
App.cable = Cable.createConsumer 'wss://' + window.location.host + '/websocket'
