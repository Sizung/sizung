module Api
  class OrganizationMembersController < ApplicationController
    # before_action :set_organization, only: [:create]
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    # POST /organization_members.json
    # def create
    #   self.resource = invite_resource
    #   resource_invited = resource.errors.empty?
    #
    #   yield resource if block_given?
    #
    #   if resource_invited
    #     if is_flashing_format? && self.resource.invitation_sent_at
    #       set_flash_message :notice, :send_instructions, :email => self.resource.email
    #     end
    #     @invited_user = User.find_by(email: params[:email])
    #     @organization_member = OrganizationMember.find_by(member_id: @invited_user.id, organization_id: params[:organization_id])
    #     if @organization_member
    #       render json: @organization_member, serializer: OrganizationMemberSerializer
    #     else
    #       render json: { errorMessage: "User invitation was not persisted" }
    #     end
    #   else
    #     render json: { errorMessage: "User could not be invited" }
    #   end
    # end

    # DELETE /organization_members/1.json
    def destroy
      @organization_member = OrganizationMember.find(params[:id])
      authorize @organization_member
      @organization_member.destroy
      render json: @organization_member, serializer: OrganizationMemberSerializer
    end

    private
      def organization_member_params
        params.require(:organization_member).permit(:organization_id, :member_id)
      end

    # def invite_resource
    #   InvitationService.new.invite(params[:email], @organization, current_user) do
    #     set_flash_message :notice, :send_instructions, email: params[:email]
    #   end
    # end
    #
    # def set_organization
    #   @organization = policy_scope(Organization).find(params[:organization_id])
    # end
  end
end
