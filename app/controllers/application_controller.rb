class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :null_session
  respond_to :html, :json

  def after_sign_in_path_for(resource)
    stored_location_for(resource) ||
      if resource.is_a?(User)
        user = resource
        organization_path(user.last_visited_organization || user.organizations.order(:created_at).last)
      else
        super
      end
  end

  protected
    def to_json_api(obj_or_list)
      ActiveModel::SerializableResource.new(obj_or_list).serializable_hash
    end
end
