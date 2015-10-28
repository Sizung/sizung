App.comments = App.cable.subscriptions.create "CommentsChannel",

  connected: ->
    console.log('CommentsChannel connected to server.')
    # FIXME: While we wait for cable subscriptions to always be finalized before sending messages
    setTimeout =>
      @followCurrentConversation()
      @installPageChangeCallback()
    , 1000

  received: (data) ->
    this.onReceived(data)

  userIsCurrentUser: (comment) ->
    $(comment).attr('data-user-id') is $('meta[name=current-user]').attr('id')

  followConversation: (conversationId) ->
    @perform 'follow', conversation_id: conversationId
    console.log('CommentsChannel following conversation: ' + conversationId)

  setOnReceived: (callback) ->
    this.onReceived = callback

  followCurrentConversation: ->
    conversationId = $('#js-conversation').data('conversation-id')
    this.followConversation(conversationId)

  unfollowConversation: ->
    @perform 'unfollow'

  installPageChangeCallback: ->
    unless @installedPageChangeCallback
      @installedPageChangeCallback = true
      $(document).on 'page:change', -> App.comments.followCurrentConversation()