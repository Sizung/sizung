App.userChannel = App.cable.subscriptions.create "UserChannel",
  connected: ->
    # Called once the subscription has been successfully completed
    console.log('UserChannel connected to server.')
    # FIXME: While we wait for cable subscriptions to always be finalized before sending messages
    setTimeout =>
      @followCurrentUser()
      @installPageChangeCallback()
    , 1000

  received: (data) ->
    this.onReceived(data)

  setOnReceived: (callback) ->
    this.onReceived = callback

  appear: ->
    @perform 'appear', appearing_on: @appearingOn()

  appearingOn: ->
    #    $('main').data 'appearing-on'
    'on my sizung page'

  followUser: (userId) ->
    @perform 'follow', user_id: userId
    console.log('UserChannel following user: ' + userId)

  followCurrentUser: ->
    currentUserId = $('#js-current-user').data('id')
    if(currentUserId)
      this.followUser(currentUserId)

  unfollowCurrentUser: ->
    @perform 'unfollow'

  installPageChangeCallback: ->
    unless @installedPageChangeCallback
      @installedPageChangeCallback = true
      $(document).on 'page:change', -> App.userChannel.followCurrentUser()
