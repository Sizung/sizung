module Api
  class ConversationObjectsController < Base
    before_filter :authenticate_user!
    after_action :verify_authorized

    respond_to :json

    # before: Completed 200 OK in 2574ms (Views: 1043.9ms | ActiveRecord: 113.4ms)
    def index
      authorize parent, :show_including_archived?
      render json: parent.conversation_objects.page(page_number).per(page_size)
    end

    private
      def initial_page_size_containing_all_unseen_objects
        unseen_count = UnseenObject.where(user: current_user, timeline: parent).count
        unseen_count < 10 ? 10 : (unseen_count + 1)
      end

      def page_number
        params[:page] ? params[:page][:number] : 1
      end

      def page_size
        params[:page] ? params[:page][:size] : initial_page_size_containing_all_unseen_objects
      end

      def parent_type
        @parent_type ||= params[:parent_type]
      end

      def parent
        @parent ||= parent_type.constantize.unscoped.find(params["#{parent_type.underscore}_id"])
      end
  end
end
