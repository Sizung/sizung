class AddTraceableToAgendaItems < ActiveRecord::Migration
  def change
    add_reference :agenda_items, :traceable, type: :uuid, polymorphic: true, index: true
  end
end
