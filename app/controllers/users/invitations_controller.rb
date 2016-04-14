class Users::InvitationsController < Devise::InvitationsController
  before_action :set_organization, only: [:create]
  before_filter :configure_permitted_parameters, if: :devise_controller?

  # def new
  #   authorize current_account, :update?
  #   super
  # end

  # POST /resource/invitation
  def create
    self.resource = invite_resource
    resource_invited = resource.errors.empty?

    yield resource if block_given?

    if resource_invited
      if is_flashing_format? && self.resource.invitation_sent_at
        set_flash_message :notice, :send_instructions, :email => self.resource.email
      end
      # respond_with resource, :location => after_invite_path_for(current_inviter)
      @invited_user = User.find_by(email: params[:user][:email])
      @organization_member = OrganizationMember.find_by(member_id: @invited_user.id, organization_id: params[:user][:organization_id])
      if @organization_member
        render json: @organization_member, serializer: OrganizationMemberSerializer
      else
        render json: { errorMessage: "User invitation was not persisted" }
      end
    else
      # redirect_to organization_organization_members_path(@organization)
      render json: { errorMessage: "User could not be invited" }
    end
  end

  private

  # this is called when creating invitation
  # should return an instance of resource class
  def invite_resource
    ## skip sending emails on invite
    # resource_class.invite!(invite_params, current_inviter) do |u|
    #   u.skip_invitation = true
    # end

    InvitationService.new.invite(invite_params[:email], @organization, current_inviter) do
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

  def after_invite_path_for(resource)
    if @organization.present?
      organization_organization_members_path(@organization)
    else
      super(resource)
    end
  end

  protected

  def configure_permitted_parameters
    # Only add some parameters
    devise_parameter_sanitizer.for(:accept_invitation).concat [:first_name, :last_name]
  end

  private
    def set_organization
      @organization = policy_scope(Organization).find(params[:user][:organization_id])
    end


end