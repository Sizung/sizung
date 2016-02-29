App.userChannel = App.cable.subscriptions.create "UserChannel",
  connected: ->
    # Called once the subscription has been successfully completed
    console.log('UserChannel connected to server.')

  received: (data) ->
    console.log 'userChannel: ', data
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

  unfollowCurrentUser: ->
    console.log('UserChannel unfollow')
    @perform 'unfollow'
