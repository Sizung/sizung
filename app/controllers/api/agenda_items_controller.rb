module Api
  class AgendaItemsController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized
    before_action :set_agenda_item, only: [:update]

    respond_to :json

    def index
      @conversation = Conversation.find(params[:conversation_id])
      authorize @conversation, :show?
      render json: @conversation.agenda_items.includes(:owner, :conversation, :deliverables)
    end

    def show
      @agenda_item = AgendaItem.unscoped.includes({ deliverables: [:owner, :assignee, :comments] }, :owner, :comments).find(params[:id])
      authorize @agenda_item, :show_including_archived?
      render json: @agenda_item, include: %w(deliverables)
    end

    # POST /agenda_items.json
    def create
      @agenda_item = AgendaItem.new(agenda_item_params)
      authorize @agenda_item
      @agenda_item.owner = current_user
      @agenda_item.save

      if @agenda_item.persisted?
        MentionedJob.perform_later(@agenda_item, current_user, agenda_item_url(id: @agenda_item.id))
        AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@agenda_item, current_user)
      end
      render json: @agenda_item, serializer: AgendaItemSerializer
    end

    # PUT/PATCH /agenda_items/1.json
    def update
      old_body = @agenda_item.title
      if @agenda_item.toggle_archive(params[:agenda_item][:archived]) || @agenda_item.update(agenda_item_params)
        MentionedJob.perform_later(@agenda_item, current_user, agenda_item_url(id: @agenda_item.id), old_body)
        AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'update')
      end
      render json: @agenda_item
    end

    private
      def agenda_item_params
        params.require(:agenda_item).permit(:conversation_id, :title, :status)
      end

      def set_agenda_item
        @agenda_item = AgendaItem.find(params[:id])
        authorize @agenda_item
      end
  end
end
