module Api
  class ConversationObjectsController < Base
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    def index
      authorize parent, :show_including_archived?
      render json: parent.conversation_objects.page(page_number).per(page_size)
    end

    private
      def page_number
        params[:page] ? params[:page][:number] : 1
      end

      def page_size
        params[:page] ? params[:page][:size] : 10
      end

      def parent_type
        @parent_type ||= params[:parent_type]
      end

      def parent
        @parent ||= parent_type.constantize.unscoped.find(params["#{parent_type.underscore}_id"])
      end
  end
end
