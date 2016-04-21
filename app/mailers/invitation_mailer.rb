class InvitationMailer < ApplicationMailer
  def existing_user_added_to_organization(user, organization, inviter)
    @user = user
    @organization = organization
    @inviter = inviter

    mail from: 'Sizung', to: user.email, subject: "You’ve been added to an organization on Sizung"
  end
end
