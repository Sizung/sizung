require 'houston'

class PushNotificationService
  include Rails.application.routes.url_helpers

  def mentioned(user, comment)
    body   = "#{comment.author.name} mentioned you: #{comment.display_body}"
    url    = timeline_url(comment.commentable)
    
    notify(user, body, url)
  end
  
  def new_comment(user, comment)
    url    = timeline_url(comment.commentable)

    notify(user, comment.display_body, url)
  end

  def assigned_deliverable(deliverable, author)
    user = deliverable.assignee
    body = "#{author} assigned you #{deliverable.title}#{due_on(deliverable)}"
    url  = timeline_url(deliverable)
    
    notify(user, body, url)
  end
  
  def resolved_deliverable(user, deliverable, author)
    body = "#{author.name} resolved #{deliverable.title}"
    url  = timeline_url(deliverable)
    
    notify(user, body, url)
  end
  
  private

  def due_on(deliverable)
    if deliverable.due_on.present?
      " (Due Date: #{deliverable.due_on.to_formatted_s})"
    end
  end
  
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
