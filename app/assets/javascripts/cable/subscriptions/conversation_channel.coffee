App.conversationChannel = App.cable.subscriptions.create "ConversationChannel",

  connected: ->
    # console.log('ConversationChannel connected to server.')

  received: (data) ->
    console.log 'convChannel: ', data
    this.onReceived(data)

  followConversation: (conversationId) ->
    @perform 'follow', conversation_id: conversationId
    # console.log('ConversationChannel following conversation: ' + conversationId)

  setOnReceived: (callback) ->
    this.onReceived = callback

  unfollowConversation: ->
    # console.log('ConversationChannel unfollow')
    @perform 'unfollow'
