class OrganizationMembersController < ApplicationController
  before_action :set_organization, only: [:index]
  before_action :set_organization_member, only: [:destroy]

  # GET /organizations/123/organization_members
  def index
    @user = User.new
    @organization_members = @organization.organization_members
  end

  # DELETE /organization_members/1
  def destroy
    if @organization_member.member == @organization.owner
      redirect_to :back, alert: 'You cannot remove the owner from an organization.'
    else
      @organization_member.destroy
      redirect_to :back
    end
  end

  private
    def set_organization
      @organization = policy_scope(Organization).find(params[:organization_id])
    end

    def set_organization_member
      @organization_member = OrganizationMember.find(params[:id])
      @organization = @organization_member.organization
    end
end