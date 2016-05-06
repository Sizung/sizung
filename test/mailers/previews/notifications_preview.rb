# Preview all emails at http://localhost:3000/rails/mailers/notifications
class NotificationsPreview < ActionMailer::Preview
  include Rails.application.routes.url_helpers

  # Preview this email at http://localhost:3000/rails/mailers/notifications/mentioned
  def mentioned
    user = User.first
    actor = User.last
    conversation = Conversation.first
    mentionable = FactoryGirl.create :agenda_item, conversation: conversation, title: "Hello @[#{user.name}](#{user.id}). How are you?", owner: actor
    target_url = agenda_item_url(mentionable, host: 'localhost')
    Notifications.mentioned(user, mentionable, actor, target_url)
  end

  # Preview this email at http://localhost:3000/rails/mailers/notifications/deliverable_assigned
  def deliverable_assigned
    actor = User.first
    deliverable = Deliverable.order(:created_at).last
    Notifications.deliverable_assigned(deliverable, actor)
  end
end
