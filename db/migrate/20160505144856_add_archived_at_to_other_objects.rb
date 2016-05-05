class AddArchivedAtToOtherObjects < ActiveRecord::Migration
  def change
    [:organizations, :organization_members, :conversation_members].each do |table| 
      add_column table, :archived_at, :datetime
    end
  end
end
