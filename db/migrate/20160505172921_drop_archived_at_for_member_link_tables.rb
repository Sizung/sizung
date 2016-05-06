class DropArchivedAtForMemberLinkTables < ActiveRecord::Migration
  def up
    [:organization_members, :conversation_members].each do |table| 
      remove_column table, :archived_at
    end
  end

  def down
    [:organization_members, :conversation_members].each do |table| 
      add_column table, :archived_at, :datetime
    end
  end
end
