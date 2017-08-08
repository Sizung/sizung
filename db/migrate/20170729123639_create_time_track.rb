class CreateTimeTrack < ActiveRecord::Migration
  def change
    create_table :time_tracks, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, index: true, null: false
      t.timestamp :in_time
      t.timestamp :out_time
      t.belongs_to :chat, type: :uuid, polymorphic: true, index: true, null: false
      t.timestamps
    end
  end
end
