# Preview all emails at http://localhost:3000/rails/mailers/meeting_invitation_mailer
class MeetingInvitationMailerPreview < ActionMailer::Preview
  include Rails.application.routes.url_helpers
  def user_invited_to_meeting
    sender = User.first
    memberEmailArray = [User.last.email]
    parent = Conversation.first
    url = conversation_url(parent, host: 'localhost')

    MeetingInvitationMailer.user_invited_to_meeting(sender, memberEmailArray, url, parent)
  end
end
