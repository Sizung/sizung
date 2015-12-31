class AddCreatedAtIndexOnCommentsAndAgendaItems < ActiveRecord::Migration
  def change
    add_index :comments, :created_at, using: :btree, order: { created_at: :desc }
    add_index :agenda_items, :created_at, using: :btree, order: { created_at: :desc }
  end
end
