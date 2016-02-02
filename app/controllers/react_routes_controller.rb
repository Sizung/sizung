class ReactRoutesController < ApplicationController
  before_filter :authenticate_user!
  layout 'conversation', only: [:index]

  respond_to :html

  def index
    @organizations_json = ActiveModel::SerializableResource.new(policy_scope(Organization)).serializable_hash
    @users = User.all.joins(:organization_members).references(:organization_members).where(organization_members: { organization: [current_user.organizations] })
    @users_json = ActiveModel::SerializableResource.new(@users).serializable_hash
  end
end
