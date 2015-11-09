class CreateConversationObjectsView < ActiveRecord::Migration
  def up
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

  def down
    drop_view :conversation_objects
  end
end
