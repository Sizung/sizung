class InvitationMailerPreview < ActionMailer::Preview
  def existing_user_added_to_organization
    user = User.first
    organization = Organization.first
    inviter = User.last
    InvitationMailer.existing_user_added_to_organization(user, organization, inviter)
  end
end
