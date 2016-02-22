class MeetingInvitationMailer < ApplicationMailer
  def user_invited_to_meeting(sender, memberEmailArray, url, parent)
      @sender = sender
      @memberEmailArray = memberEmailArray
      @url = url
      @parent = parent

      mail to: memberEmailArray, cc: sender.email, subject: sender.first_name + ' is pinging you.'
  end
end
