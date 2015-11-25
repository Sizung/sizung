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
    @deliverable.save

    if @deliverable.persisted?
      DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'create')
    end

    render json: @deliverable, serializer: DeliverableSerializer
  end

  # PUT/PATCH /deliverables/1.json
  def update
    if @deliverable.update(deliverable_params)
      DeliverableRelayJob.perform_later(deliverable: @deliverable, actor_id: current_user.id, action: 'update')
    end
    render json: @deliverable
  end

  private
    def deliverable_params
      params.require(:deliverable).permit(:agenda_item_id, :title)
    end

    def set_deliverable
      @deliverable = Deliverable.find(params[:id])
      authorize @deliverable
    end
end
