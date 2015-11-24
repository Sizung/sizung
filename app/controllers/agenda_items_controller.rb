class AgendaItemsController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized
  before_action :set_agenda_item, only: [:update, :destroy]

  respond_to :json

  # POST /agenda_items.json
  def create
    @agenda_item = AgendaItem.new(agenda_item_params)
    authorize @agenda_item
    @agenda_item.owner = current_user
    @agenda_item.save
    if @agenda_item.persisted?
      AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'create')
    end
    render json: @agenda_item, serializer: AgendaItemSerializer
  end

  # PUT/PATCH /agenda_items/1.json
  def update
    if @agenda_item.update(agenda_item_params)
      AgendaItemRelayJob.perform_later(agenda_item: @agenda_item, actor_id: current_user.id, action: 'update')
    end
    render json: @agenda_item
  end

  # DELETE /agenda_items/1.json
  def destroy
    @agenda_item.destroy
    render json: @agenda_item, status: :ok
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
