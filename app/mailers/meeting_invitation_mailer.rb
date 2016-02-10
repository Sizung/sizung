class MeetingInvitationMailer < ApplicationMailer
  def user_invited_to_meeting(sender, memberEmailArray, url)
      @sender = sender
      @memberEmailArray = memberEmailArray
      @url = url

      mail to: memberEmailArray, cc: 'ani@sizung.com'
  end
end
