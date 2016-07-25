require 'houston'

class NotificationService
  include Rails.application.routes.url_helpers

  # Sends the necessary notifications to a user that has been mentioned
  def mentioned(user, comment)
    author = comment.author
    url    = timeline_url(comment.commentable)

    # send a notification to the iOS device if possible
    notify(user, comment.display_body, url)

    # send an email
    Notifications.mentioned(user, comment, author, url).deliver_later
  end

  def new_comment(user, comment)
    author = comment.author
    url    = timeline_url(comment.commentable)

    # send a notification to the iOS device if possible
    notify(user, comment.display_body, url)
  end

  def assigned_agenda_item(agenda_item, author)
    Notifications.agenda_item_assigned(agenda_item, author).deliver_later
  end

  def unassigned_agenda_item(agenda_item, old_owner, author)
    Notifications.agenda_item_unassigned(agenda_item, old_owner, author).deliver_later
  end

  def assigned_deliverable(deliverable, author)
    Notifications.deliverable_assigned(deliverable, author).deliver_later
  end

  def unassigned_deliverable(deliverable, old_assignee, author)
    Notifications.deliverable_unassigned(deliverable, old_assignee, author).deliver_later
  end

  # TODO Make that a private method. It's to specific to be used directly outside of the NotificationService responsibility
  # sends a notification to the iOS device when the user has one registered
  def notify(user, body, url)
    raise ArgumentError('user and body must be present to notify a user') unless user && body
    return unless ENV['APN_CERTIFICATE_DATA']

    # Environment variables are automatically read, or can be overridden by any specified options. You can also
    # conveniently use `Houston::Client.development` or `Houston::Client.production`.
    apn = ENV['APN_ENV'] == 'production' ? Houston::Client.production : Houston::Client.development

    apn.certificate = ENV['APN_CERTIFICATE_DATA']

    user.devices.each do |device|
      token = device.token

      # Create a notification that alerts a message to the user, plays a sound, and sets the badge on the app
      notification = Houston::Notification.new(device: token)
      notification.alert = body

      # Notifications can also change the badge count, have a custom sound, have a category identifier, indicate available Newsstand content, or pass along arbitrary data.
      # notification.badge = 57
      # notification.sound = "sosumi.aiff"
      # notification.category = "INVITE_CATEGORY"
      # notification.content_available = true
      notification.custom_data = { link: url } if url

      apn.push(notification)
    end
  end

  private
  def timeline_url(timeline)
    case timeline
    when AgendaItem
      agenda_item_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    when Deliverable
      deliverable_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    when Conversation
      conversation_url(timeline.id, host: ActionMailer::Base.default_url_options[:host])
    else
      raise ArgumentError, "Only urls to Conversations, Deliverables or AgendaItems are supported but got: #{timeline}"
    end
  end
end
