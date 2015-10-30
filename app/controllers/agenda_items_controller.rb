class AgendaItemsController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  # POST /agenda_items.json
  def create
    @agenda_item = AgendaItem.new(agenda_item_params)
    authorize @agenda_item
    @agenda_item.owner = current_user
    @agenda_item.save
    respond_with(@agenda_item)
  end

  private
    def agenda_item_params
      params.require(:agenda_item).permit(:conversation_id, :title)
    end
end
