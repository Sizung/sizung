class CreateDeliverables < ActiveRecord::Migration
  def up
    drop_view :conversation_objects

    create_table :deliverables, id: :uuid do |t|
      t.belongs_to :agenda_item, type: :uuid, index: true, foreign_key: true
      t.belongs_to :owner, type: :uuid, index: true
      t.string :title, null: false
      t.text :description

      t.timestamps null: false
    end

    add_foreign_key :deliverables, :users, column: :owner_id

    create_view :conversation_objects, <<-ENDOFLINE
        SELECT  comments.id,
                'Comment'::text AS type,
                comments.commentable_id AS parent_id,
                comments.created_at,
                comments.updated_at,
                comments.commentable_id,
                comments.commentable_type,
                NULL::uuid AS conversation_id,
                comments.author_id,
                NULL::uuid AS owner_id,
                NULL::character varying AS title,
                comments.body,
                NULL::character varying as status,
                NULL::uuid AS agenda_item_id,
                NULL::text AS description
        FROM comments
      UNION ALL
        SELECT  agenda_items.id,
                'AgendaItem'::text AS type,
                agenda_items.conversation_id AS parent_id,
                agenda_items.created_at,
                agenda_items.updated_at,
                NULL::uuid AS commentable_id,
                NULL::character varying AS commentable_type,
                agenda_items.conversation_id,
                NULL::uuid AS author_id,
                agenda_items.owner_id,
                agenda_items.title,
                NULL::text AS body,
                agenda_items.status,
                NULL::uuid AS agenda_item_id,
                NULL::text AS description
        FROM agenda_items
      UNION ALL
        SELECT  deliverables.id,
                'Deliverable'::text AS type,
                deliverables.agenda_item_id AS parent_id,
                deliverables.created_at,
                deliverables.updated_at,
                NULL::uuid AS commentable_id,
                NULL::character varying AS commentable_type,
                NULL::uuid AS conversation_id,
                NULL::uuid AS author_id,
                deliverables.owner_id,
                deliverables.title,
                NULL::text AS body,
                NULL::character varying AS status,
                deliverables.agenda_item_id,
                deliverables.description
        FROM deliverables;
    ENDOFLINE
  end

  def down
    drop_view :conversation_objects

    remove_foreign_key :deliverables, column: :owner_id
    drop_table :deliverables

    create_view :conversation_objects, <<-ENDOFLINE
        SELECT  comments.id,
                'Comment'::text AS type,
                comments.commentable_id AS parent_id,
                comments.created_at,
                comments.updated_at,
                comments.commentable_id,
                comments.commentable_type,
                NULL::uuid AS conversation_id,
                comments.author_id,
                NULL::uuid AS owner_id,
                NULL::character varying AS title,
                comments.body,
                NULL::character varying as status
        FROM comments
      UNION ALL
        SELECT  agenda_items.id,
                'AgendaItem'::text AS type,
                agenda_items.conversation_id AS parent_id,
                agenda_items.created_at,
                agenda_items.updated_at,
                NULL::uuid AS commentable_id,
                NULL::character varying AS commentable_type,
                agenda_items.conversation_id,
                NULL::uuid AS author_id,
                agenda_items.owner_id,
                agenda_items.title,
                NULL::text AS body,
                agenda_items.status
        FROM agenda_items;
    ENDOFLINE
  end
end
