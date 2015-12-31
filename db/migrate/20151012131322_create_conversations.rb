class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations, id: :uuid do |t|
      t.string :title, null: false
      t.belongs_to :organization, null: false, type: :uuid, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
