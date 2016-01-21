App.organizationChannel = App.cable.subscriptions.create "OrganizationChannel",
  connected: ->
    # Called once the subscription has been successfully completed
    # console.log('OrganizationChannel connected to server.')

  received: (data) ->
    this.onReceived(data)

  setOnReceived: (callback) ->
    this.onReceived = callback

  followOrganization: (organizationId) ->
    @perform 'follow', organization_id: organizationId
    # console.log('OrganizationChannel following organization: ' + organizationId)

  unfollowOrganization: ->
    # console.log('OrganizationChannel unfollow')
    @perform 'unfollow'
