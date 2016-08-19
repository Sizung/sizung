module Api
  module V1
    class AgendaItemsController < Base
      before_filter :authenticate_user!
      after_action :verify_authorized, except: :index
      after_action :verify_policy_scoped, only: :index

      respond_to :json

      def index
        if params[:conversation_id]
          parent = policy_scope(Conversation).find(params[:conversation_id])
        elsif params[:organization_id]
          parent = policy_scope(Organization).find(params[:organization_id])
        end
        @agenda_items = parent.agenda_items.includes(:owner, :conversation)
        if params[:page]
          if params[:page][:number]
            @agenda_items = @agenda_items.page(params[:page][:number])
          end
          if params[:page][:size]
            @agenda_items = @agenda_items.per(params[:page][:size])
          end
        else
          @agenda_items = @agenda_items.page(1).per(10)
        end

        render json: @agenda_items,
               each_serializer: Api::V1::AgendaItemSerializer
      end

      def show
        @agenda_item = AgendaItem.unscoped.includes(:owner).find(params[:id])
        authorize @agenda_item, :show_including_archived?
        render json: @agenda_item,
               serializer: Api::V1::AgendaItemSerializer
      end
    end
    
  end
end
