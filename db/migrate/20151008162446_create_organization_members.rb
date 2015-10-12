class CreateOrganizationMembers < ActiveRecord::Migration
  def change
    create_table :organization_members do |t|
      t.belongs_to :organization, type: :uuid, index: true, foreign_key: true
      t.belongs_to :member, type: :uuid, index: true

      t.timestamps null: false
    end

    add_foreign_key :organization_members, :users, column: :member_id
  end
end
