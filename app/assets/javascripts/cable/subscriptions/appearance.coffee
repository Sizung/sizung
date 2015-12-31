App.appearance = App.cable.subscriptions.create "AppearanceChannel",
  connected: ->
    # Called once the subscription has been successfully completed
    console.log('AppearanceChannel connected to server.')
    # FIXME: While we wait for cable subscriptions to always be finalized before sending messages
    setTimeout =>
      @followCurrentOrganization()
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

  followOrganization: (organizationId) ->
    @perform 'follow', organization_id: organizationId
    console.log('AppearanceChannel following organization: ' + organizationId)

  followCurrentOrganization: ->
    organizationId = $('#js-organization').data('organization-id')
    if(organizationId)
      this.followOrganization(organizationId)

  unfollowOrganization: ->
    @perform 'unfollow'

  installPageChangeCallback: ->
    unless @installedPageChangeCallback
      @installedPageChangeCallback = true
      $(document).on 'page:change', -> App.appearance.followCurrentOrganization()
