class AddAssigneeDueAtAndStatusToDeliverables < ActiveRecord::Migration
  def up
    drop_view :conversation_objects

    add_column :deliverables, :assignee_id, :uuid, index: true
    add_foreign_key :deliverables, :users, column: :assignee_id

    change_column_null :deliverables, :owner_id, false

    add_column :deliverables, :due_at, :datetime
    add_column :deliverables, :status, :string, default: 'open', null: false

    Deliverable.all.each do |deliverable|
      deliverable.assignee_id = deliverable.owner_id
      deliverable.save
    end

    change_column_null :deliverables, :assignee_id, false

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
                NULL::timestamp without time zone AS due_at
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
                NULL::timestamp without time zone AS due_at
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
                deliverables.due_at
        FROM deliverables;
    ENDOFLINE
  end

  def down
    drop_view :conversation_objects

    remove_foreign_key :deliverables, column: :assignee_id
    remove_column :deliverables, :assignee_id
    remove_column :deliverables, :due_at
    remove_column :deliverables, :status

    change_column_null :deliverables, :owner_id, true

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
end
