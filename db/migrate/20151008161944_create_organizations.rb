class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations, id: :uuid do |t|
      t.string :name, null: false
      t.text :mission
      t.references :owner, type: :uuid, index: true

      t.timestamps null: false
    end

    add_foreign_key :organizations, :users, column: :owner_id
  end
end
