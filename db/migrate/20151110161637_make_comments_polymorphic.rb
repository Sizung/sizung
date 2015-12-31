class MakeCommentsPolymorphic < ActiveRecord::Migration
  def up
    drop_view :conversation_objects

    remove_index :comments, :conversation_id
    remove_foreign_key :comments, :conversation
    rename_column :comments, :conversation_id, :commentable_id
    add_column :comments, :commentable_type, :string, default: 'Conversation'
    add_index :comments, [:commentable_type, :commentable_id]

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

  def down
    drop_view :conversation_objects

    remove_index :comments, [:commentable_type, :commentable_id]
    remove_column :comments, :commentable_type, :string
    rename_column :comments, :commentable_id, :conversation_id
    add_index :comments, :conversation_id
    add_foreign_key :comments, :conversations

    create_view :conversation_objects, <<-ENDOFLINE
      SELECT comments.id, 'Comment'::text AS type,
                  comments.conversation_id, comments.author_id, comments.created_at,
                  comments.updated_at,
                  NULL::uuid AS owner_id, NULL::character varying AS title,
                  comments.body, NULL::character varying as status
                 FROM comments
      UNION ALL
               SELECT agenda_items.id, 'AgendaItem'::text AS type,
                  agenda_items.conversation_id, NULL::uuid AS author_id,
                  agenda_items.created_at, agenda_items.updated_at, agenda_items.owner_id, agenda_items.title,
                  NULL::text AS body, agenda_items.status
                 FROM agenda_items;
    ENDOFLINE
  end
end
