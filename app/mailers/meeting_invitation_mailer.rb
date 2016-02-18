class MeetingInvitationMailer < ApplicationMailer
  def user_invited_to_meeting(sender, memberEmailArray, url, parent)
      @sender = sender
      @memberEmailArray = memberEmailArray
      @url = url
      @parent = parent

      mail to: memberEmailArray, cc: sender.email, subject: 'Meeting Invite: "' + (parent.title.length > 30 ? parent.title.first(30) + '...' : parent.title) + '" (' + sender.email + ')'
  end
end
