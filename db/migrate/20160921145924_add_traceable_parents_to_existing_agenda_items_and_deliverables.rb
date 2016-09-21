class AddTraceableParentsToExistingAgendaItemsAndDeliverables < ActiveRecord::Migration
  def change
    AgendaItem.where(traceable_id: nil).each do |agenda_item|
      agenda_item.update(traceable_id: agenda_item.conversation_id, traceable_type: 'Conversation')
    end

    Deliverable.where(traceable_id: nil).each do |deliverable|
      deliverable.update(traceable_id: deliverable.parent_id, traceable_type: deliverable.parent_type)
    end
  end
end
