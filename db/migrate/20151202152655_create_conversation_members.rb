class CreateConversationMembers < ActiveRecord::Migration
  def change
    create_table :conversation_members, id: :uuid do |t|
      t.belongs_to :conversation, type: :uuid, index: true, foreign_key: true
      t.belongs_to :member, type: :uuid, index: true

      t.timestamps null: false
    end

    add_foreign_key :conversation_members, :users, column: :member_id
  end
end
