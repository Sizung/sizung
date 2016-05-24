class CreateAttachments < ActiveRecord::Migration
  def up
    drop_view :conversation_objects
    
    create_table :attachments, id: :uuid do |t|
      t.belongs_to :parent, type: :uuid, polymorphic: true, index: true
      t.belongs_to :owner, type: :uuid, index: true
      t.string :persistent_file_id
      t.string :file_name
      t.integer :file_size
      t.datetime :archived_at

      t.timestamps null: false
    end

    add_foreign_key :attachments, :users, column: :owner_id

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
                NULL::integer AS comments_count,
                NULL::character varying as persistent_file_id,
                NULL::character varying as file_name,
                NULL::integer as file_size
        FROM comments
      UNION ALL
        SELECT  attachments.id,
                'Attachment'::text AS type,
                attachments.parent_id,
                attachments.parent_type,
                attachments.created_at,
                attachments.updated_at,
                NULL::uuid AS commentable_id,
                NULL::character varying AS commentable_type,
                NULL::uuid AS conversation_id,
                NULL::uuid AS author_id,
                attachments.owner_id,
                NULL::character varying AS title,
                NULL::text AS body,
                NULL::character varying as status,
                NULL::text AS description,
                NULL::uuid AS assignee_id,
                NULL::date AS due_on,
                NULL::character varying as archive_number,
                attachments.archived_at,
                NULL::integer AS deliverables_count,
                NULL::integer AS comments_count,
                attachments.persistent_file_id,
                attachments.file_name,
                attachments.file_size
        FROM attachments
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
                agenda_items.comments_count,
                NULL::character varying as persistent_file_id,
                NULL::character varying as file_name,
                NULL::integer as file_size
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
                deliverables.comments_count,
                NULL::character varying as persistent_file_id,
                NULL::character varying as file_name,
                NULL::integer as file_size
        FROM deliverables;
    ENDOFLINE
  end

  def down
    drop_view :conversation_objects

    remove_foreign_key :attachments, column: :owner_id
    drop_table :attachments

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
end
