class CreateTimelineUsers < ActiveRecord::Migration
  def change
    create_table :timeline_users, id: :uuid do |t|
      t.belongs_to :timeline, type: :uuid, polymorphic: true, index: true, null: false
      t.belongs_to :user, type: :uuid, index: true, foreign_key: true, null: false
      t.string :subscription_level

      t.timestamps null: false
    end
  end
end
