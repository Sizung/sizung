class Users::InvitationsController < Devise::InvitationsController

  # def new
  #   authorize current_account, :update?
  #   super
  # end

  private

  # this is called when creating invitation
  # should return an instance of resource class
  def invite_resource
    ## skip sending emails on invite
    # resource_class.invite!(invite_params, current_inviter) do |u|
    #   u.skip_invitation = true
    # end

    #TODO: Track the selected organization in the session or let the user select on the invite-user page
    current_organization = current_user.organizations.first
    InvitationService.new.invite(invite_params[:email], current_organization, current_inviter) do
      set_flash_message :notice, :send_instructions, email: invite_params[:email]
    end
  end

  # this is called when accepting invitation
  # should return an instance of resource class
  def accept_resource
    resource = resource_class.accept_invitation!(update_resource_params)
    ## Report accepting invitation to analytics
    # Analytics.report('invite.accept', resource.id)

    resource
  end
end