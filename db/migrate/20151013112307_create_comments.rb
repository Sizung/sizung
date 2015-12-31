class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments, id: :uuid do |t|
      t.belongs_to :conversation, type: :uuid, index: true, foreign_key: true
      t.belongs_to :author, type: :uuid, index: true
      t.text :body

      t.timestamps null: false
    end

    add_foreign_key :comments, :users, column: :author_id
  end
end
