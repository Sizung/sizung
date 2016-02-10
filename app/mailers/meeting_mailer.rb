class MeetingMailer < ApplicationMailer
  def user_called_for_meeting(user)
    @user = user

    mail to: user.email
  end
end
