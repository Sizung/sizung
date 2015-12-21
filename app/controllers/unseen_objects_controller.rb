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
    @unseen_objects = current_user.unseen_objects.where(agenda_item: parent).where(target_type: %w(Comment Deliverable))
    p UnseenObject.all.size
    deleted_unseen_objects = @unseen_objects.destroy_all
    p deleted_unseen_objects.size
    render json: deleted_unseen_objects
  end

  private
    def parent_type
      @parent_type ||= params[:parent_type]
    end

    def parent
      @parent ||= parent_type.constantize.find(params["#{parent_type.underscore}_id"])
    end
end
