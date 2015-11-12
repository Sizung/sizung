class ConversationObjectsController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  def index
    authorize parent, :show?
    render json: parent.conversation_objects
  end

  private
    def parent_type
      @parent_type ||= params[:parent_type]
    end

    def parent
      @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
    end
end
