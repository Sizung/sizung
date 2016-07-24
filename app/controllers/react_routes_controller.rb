class ReactRoutesController < ApplicationController
  before_filter :authenticate_user!, only: [:index]
  layout 'conversation', only: [:index, :new_registration]

  respond_to :html

  def index
    @organizations = policy_scope(Organization).includes(:owner, :organization_members)
    @organizations_json = ActiveModelSerializers::SerializableResource.new(@organizations).serializable_hash
    @users = User.all.joins(:organization_members).references(:organization_members).where(organization_members: { organization: current_user.organizations })
    @users_json = ActiveModelSerializers::SerializableResource.new(@users).serializable_hash
  end

  def new_registration

  end

end
