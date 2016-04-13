module Api
  class OrganizationMembersController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    # POST /organization_members.json
    def create
      @organization_member = OrganizationMember.new(organization_member_params)
      authorize @organization_member
      @organization_member.save
      render json: @organization_member, serializer: OrganizationMemberSerializer
    end

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
  end
end
