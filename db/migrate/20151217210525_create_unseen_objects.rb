class CreateUnseenObjects < ActiveRecord::Migration
  def change
    create_table :unseen_objects, id: :uuid do |t|
      t.belongs_to :organization, type: :uuid, index: true, foreign_key: true
      t.belongs_to :conversation, type: :uuid, index: true, foreign_key: true
      t.belongs_to :agenda_item,  type: :uuid, index: true, foreign_key: true
      t.belongs_to :deliverable,  type: :uuid, index: true, foreign_key: true
      t.belongs_to :target,       type: :uuid, polymorphic: true, index: true
      t.belongs_to :user,         type: :uuid, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
