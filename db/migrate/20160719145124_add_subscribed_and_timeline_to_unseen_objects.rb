class AddSubscribedAndTimelineToUnseenObjects < ActiveRecord::Migration
  def change
    add_column :unseen_objects, :subscribed, :boolean, null: false, default: false
    add_reference :unseen_objects, :timeline, type: :uuid, polymorphic: true, index: true
  end
end
