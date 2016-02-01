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
    @deliverable.assignee = current_user
    @deliverable.save

    if @deliverable.persisted?
      DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'create')
      UnseenService.new.handle_with(@deliverable, current_user)
    end

    render json: @deliverable, serializer: DeliverableSerializer
  end

  # PUT/PATCH /deliverables/1.json
  def update
    original_agenda_item_id = @deliverable.agenda_item_id
    if @deliverable.toggle_archive(params[:deliverable][:archived]) || @deliverable.update(deliverable_params)
      DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'update')
      if(deliverable_params[:agenda_item_id].present? && deliverable_params[:agenda_item_id] != original_agenda_item_id)
        AgendaItemRelayJob.perform_later(agenda_item: AgendaItem.find(original_agenda_item_id), actor_id: nil, action: 'update')
        UnseenService.new.moved(@deliverable, current_user)
      end
    end
    render json: @deliverable
  end

  private
    def deliverable_params
      params.require(:deliverable).permit(:agenda_item_id, :title, :assignee_id, :status, :due_on)
    end

    def set_deliverable
      @deliverable = Deliverable.find(params[:id])
      authorize @deliverable
    end
end
