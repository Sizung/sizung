class InvitationMailer < ApplicationMailer
  def existing_user_added_to_organization(user, organization, inviter)
    @user = user
    @organization = organization
    @inviter = inviter

    mail to: user.email
  end
end
