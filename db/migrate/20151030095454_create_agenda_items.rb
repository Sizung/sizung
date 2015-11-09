class CreateAgendaItems < ActiveRecord::Migration
  def change
    create_table :agenda_items, id: :uuid do |t|
      t.belongs_to :conversation, type: :uuid, index: true, foreign_key: true
      t.belongs_to :owner, type: :uuid, index: true
      t.string :title, null: false
      t.string :status, null: false, default: 'open'

      t.timestamps null: false
    end

    add_foreign_key :agenda_items, :users, column: :owner_id
  end
end
