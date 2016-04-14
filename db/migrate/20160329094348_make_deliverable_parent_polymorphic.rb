class MakeDeliverableParentPolymorphic < ActiveRecord::Migration
  def up
    drop_view :conversation_objects
    
    remove_foreign_key :deliverables, :agenda_items
    rename_column :deliverables, :agenda_item_id, :parent_id
    add_column :deliverables, :parent_type, :string, null: false, default: 'AgendaItem'
    add_column :conversations, :deliverables_count, :integer, null: false, default: 0

    create_view :conversation_objects, <<-ENDOFLINE
        SELECT  comments.id,
                'Comment'::text AS type,
                comments.commentable_id AS parent_id,
                comments.commentable_type AS parent_type,
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
                NULL::text AS description,
                NULL::uuid AS assignee_id,
                NULL::date AS due_on,
                comments.archive_number,
                comments.archived_at,
                NULL::integer AS deliverables_count,
                NULL::integer AS comments_count
        FROM comments
      UNION ALL
        SELECT  agenda_items.id,
                'AgendaItem'::text AS type,
                agenda_items.conversation_id AS parent_id,
                'Conversation'::text AS parent_type,
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
                NULL::text AS description,
                NULL::uuid AS assignee_id,
                NULL::date AS due_on,
                agenda_items.archive_number,
                agenda_items.archived_at,
                agenda_items.deliverables_count,
                agenda_items.comments_count
        FROM agenda_items
      UNION ALL
        SELECT  deliverables.id,
                'Deliverable'::text AS type,
                deliverables.parent_id,
                deliverables.parent_type,
                deliverables.created_at,
                deliverables.updated_at,
                NULL::uuid AS commentable_id,
                NULL::character varying AS commentable_type,
                NULL::uuid AS conversation_id,
                NULL::uuid AS author_id,
                deliverables.owner_id,
                deliverables.title,
                NULL::text AS body,
                deliverables.status,
                deliverables.description,
                deliverables.assignee_id,
                deliverables.due_on,
                deliverables.archive_number,
                deliverables.archived_at,
                NULL::integer AS deliverables_count,
                deliverables.comments_count
        FROM deliverables;
    ENDOFLINE
  end

  def down
    drop_view :conversation_objects
    
    rename_column :deliverables, :parent_id, :agenda_item_id
    remove_column :deliverables, :parent_type
    add_foreign_key :deliverables, :agenda_items, on_delete: :cascade
    remove_column :conversations, :deliverables_count

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
                NULL::text AS description,
                NULL::uuid AS assignee_id,
                NULL::date AS due_on,
                comments.archive_number,
                comments.archived_at,
                NULL::integer AS deliverables_count,
                NULL::integer AS comments_count
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
                NULL::text AS description,
                NULL::uuid AS assignee_id,
                NULL::date AS due_on,
                agenda_items.archive_number,
                agenda_items.archived_at,
                agenda_items.deliverables_count,
                agenda_items.comments_count
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
                deliverables.status,
                deliverables.agenda_item_id,
                deliverables.description,
                deliverables.assignee_id,
                deliverables.due_on,
                deliverables.archive_number,
                deliverables.archived_at,
                NULL::integer AS deliverables_count,
                deliverables.comments_count
        FROM deliverables;
    ENDOFLINE
  end
end
