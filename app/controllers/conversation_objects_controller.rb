class ConversationObjectsController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  def index
    authorize parent, :show?
    page_number = params[:page_number]  || 1
    page_size   = params[:page_size]    || 2
    render json: parent.conversation_objects.page(page_number).per(page_size)
  end

  private
    def parent_type
      @parent_type ||= params[:parent_type]
    end

    def parent
      @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
    end
end
