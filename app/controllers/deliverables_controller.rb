class DeliverablesController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized

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

  private
    def deliverable_params
      params.require(:deliverable).permit(:agenda_item_id, :title)
    end
end
