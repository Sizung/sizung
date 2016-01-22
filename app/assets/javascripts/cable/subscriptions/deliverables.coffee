App.deliverables = App.cable.subscriptions.create "DeliverablesChannel",

  connected: ->
    console.log('DeliverablesChannel connected to server.')
    # FIXME: While we wait for cable subscriptions to always be finalized before sending messages
    setTimeout =>
      @followCurrentConversation()
      @installPageChangeCallback()
    , 1000

  received: (data) ->
    this.onReceived(data)

  userIsCurrentUser: (deliverable) ->
    $(deliverable).attr('data-user-id') is $('meta[name=current-user]').attr('id')

  followConversation: (conversationId) ->
    @perform 'follow', conversation_id: conversationId
    console.log('DeliverablesChannel following conversation: ' + conversationId)

  setOnReceived: (callback) ->
    this.onReceived = callback

  followCurrentConversation: ->
    conversationId = $('#js-conversation').data('conversation-id')
    if(conversationId)
      this.followConversation(conversationId)

  unfollowConversation: ->
    @perform 'unfollow'

  installPageChangeCallback: ->
    unless @installedPageChangeCallback
      @installedPageChangeCallback = true
      $(document).on 'page:change', -> App.deliverables.followCurrentConversation()
