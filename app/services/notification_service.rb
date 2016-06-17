require 'houston'

class NotificationService
  def notify(user, body, url)
    raise ArgumentError('user and body must be present to notify a user') unless user && body
    return unless ENV['APN_CERTIFICATE_DATA']
    
    # Environment variables are automatically read, or can be overridden by any specified options. You can also
    # conveniently use `Houston::Client.development` or `Houston::Client.production`.
    apn = ENV['APN_ENV'] == 'production' ? Houston::Client.production : Houston::Client.development

    # apn.certificate = ENV['APN_CERTIFICATE_DATA']

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
end
