class InvitationService
  def invite(invited_email_address, current_organization, current_inviter, admin = false, &block)
    admin ||= false
    existing_user = User.find_by(email: invited_email_address)

    if existing_user && existing_user.accepted_or_not_invited?
      # TODO: Should we let the existing user decide if he wants to be added to that organization?
      # TODO: What should be the difference between an existing active user and and existing but pending (got invited) user?
      existing_user.organization_members.create(organization: current_organization, admin: admin)

      yield if block_given? # run block when an invitation email was sent

      InvitationMailer.existing_user_added_to_organization(existing_user, current_organization, current_inviter).deliver_now
      existing_user
    else
      User.invite!({email: invited_email_address}, current_inviter) do |u|
        u.organization_members.build(organization: current_organization, admin: admin)
      end
    end
  end
end
