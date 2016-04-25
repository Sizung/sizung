module Api
  class DeliverablesController < ApplicationController
    before_filter :authenticate_user!
    after_action :verify_authorized
    before_action :set_deliverable, only: [:update]

    respond_to :json

    # POST /deliverables.json
    def create
      @deliverable = Deliverable.new(deliverable_params)
      authorize @deliverable
      @deliverable.owner = current_user
      @deliverable.assignee_id = current_user.id unless @deliverable.assignee_id
      @deliverable.save

      if @deliverable.persisted?
        MentionedJob.perform_later(@deliverable, current_user, deliverable_url(id: @deliverable.id))
        DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'create')
        UnseenService.new.handle_with(@deliverable, current_user)
      end

      render json: @deliverable, serializer: DeliverableSerializer
    end

    def show
      @deliverable = Deliverable.unscoped.includes(:parent, :owner, :assignee).find(params[:id])
      authorize @deliverable, :show_including_archived?
      render json: @deliverable, include: %w(parent conversation)
    end

    # PUT/PATCH /deliverables/1.json
    def update
      old_body = @deliverable.title
      original_parent_id = @deliverable.parent_id
      original_parent_type = @deliverable.parent_type
      if @deliverable.toggle_archive(params[:deliverable][:archived]) || @deliverable.update(deliverable_params)
        MentionedJob.perform_later(@deliverable, current_user, deliverable_url(id: @deliverable.id), old_body)
        DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'update')
        if(deliverable_params[:parent_id].present? && deliverable_params[:parent_id] != original_parent_id)
          # TODO: We probably want to do that for conversation as a parent also
          AgendaItemRelayJob.perform_later(agenda_item: AgendaItem.find(original_parent_id), actor_id: nil, action: 'update') if original_parent_type == 'AgendaItem'
          MovedDeliverableJob.perform_later(@deliverable, current_user)
        end
      end
      render json: @deliverable
    end

    private
      def deliverable_params
        params.require(:deliverable).permit(:parent_id, :parent_type, :title, :assignee_id, :status, :due_on)
      end

      def set_deliverable
        @deliverable = Deliverable.find(params[:id])
        authorize @deliverable
      end
  end
end
