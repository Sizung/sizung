class AddFirstNameLastNameToUsers < ActiveRecord::Migration
  def change
    add_column :users, :first_name, :string, null: false, default: 'Change'
    add_column :users, :last_name, :string, null: false, default: 'in Profile'

    change_column_default :users, :first_name, nil
    change_column_default :users, :last_name, nil
  end
end
