class AddArchivedAtToConversations < ActiveRecord::Migration
  def change
    add_column :conversations, :archived_at, :datetime
    add_column :conversations, :archive_number, :string
  end
end
