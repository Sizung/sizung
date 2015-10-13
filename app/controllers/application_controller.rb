class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def after_sign_in_path_for(resource)
    stored_location_for(resource) ||
      if resource.is_a?(User)
        user = resource
        organization = user.organizations.order(:created_at).last
        conversation = organization.conversations.order(:created_at).first
        conversation_path(conversation)
      else
        super
      end
  end
end
