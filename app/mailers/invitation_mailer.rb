class InvitationMailer < ApplicationMailer
  def existing_user_added_to_organization(user)
    @user = user

    mail to: user.email
  end
end
