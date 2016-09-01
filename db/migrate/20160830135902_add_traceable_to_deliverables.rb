class AddTraceableToDeliverables < ActiveRecord::Migration
  def change
    add_reference :deliverables, :traceable, type: :uuid, polymorphic: true, index: true
  end
end
