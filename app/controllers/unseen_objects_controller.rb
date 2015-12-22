class UnseenObjectsController < ApplicationController
  before_filter :authenticate_user!
  # after_action :verify_authorized

  respond_to :json

  def index
    authorize parent, :show?
    render json: parent.conversation_objects.page(page_number).per(page_size)
  end

  def destroy_all
    # authorize parent, :show?
    deleted_unseen_objects = scope_to_delete(current_user.unseen_objects)
    render json: deleted_unseen_objects
  end

  private
    def parent_type
      @parent_type ||= params[:parent_type]
    end

    def parent
      @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
    end

    def scope_to_delete(scope)
      case params[:parent_type]
        when 'Conversation'
          scope.where(conversation: parent).where("target_type = 'AgendaItem' OR (target_type = 'Comment' AND agenda_item_id IS NULL)").destroy_all
        when 'AgendaItem'
          scope.where(agenda_item: parent).where("target_type = 'Deliverable' OR (target_type = 'Comment' AND deliverable_id IS NULL)").destroy_all
        when 'Deliverable'
          scope.where(deliverable: parent).destroy_all
        else
          []
      end
    end
end
