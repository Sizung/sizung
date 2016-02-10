# Preview all emails at http://localhost:3000/rails/mailers/notifications
class NotificationsPreview < ActionMailer::Preview
  include Rails.application.routes.url_helpers

  # Preview this email at http://localhost:3000/rails/mailers/notifications/mentioned
  def mentioned
    user = User.first
    conv = Conversation.first
    target_url = conversation_url(conv, host: 'localhost')
    Notifications.mentioned(user, target_url)
  end
end
