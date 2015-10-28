class AddPresenceStatusToUsers < ActiveRecord::Migration
  def change
    add_column :users, :presence_status, :string
  end
end
