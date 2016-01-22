class AddCascadingForeignKeys < ActiveRecord::Migration
  def up
    remove_foreign_key "agenda_items", "conversations"
    remove_foreign_key "deliverables", "agenda_items"

    add_foreign_key "agenda_items", "conversations", on_delete: :cascade
    add_foreign_key "deliverables", "agenda_items", on_delete: :cascade
  end

  def down
    remove_foreign_key "agenda_items", "conversations"
    remove_foreign_key "deliverables", "agenda_items"

    add_foreign_key "agenda_items", "conversations"
    add_foreign_key "deliverables", "agenda_items"
  end
end
