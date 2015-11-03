class AddAttachmentToComments < ActiveRecord::Migration
  def change
    add_column :comments, :attachment_id, :uuid
    add_column :comments, :attachment_type, :string
  end
end
