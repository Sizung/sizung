class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, index: true, foreign_key: true, null: false
      t.string :token, null: false

      t.timestamps null: false
    end
  end
end
