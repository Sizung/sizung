class AddAdminFlagToOrganizationMembers < ActiveRecord::Migration
  def up
    add_column :organization_members, :admin, :boolean, null: false, default: true
    change_column_default :organization_members, :admin, false
  end

  def down
    remove_column :organization_members, :admin
  end
end
