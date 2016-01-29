# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160129160913) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "agenda_items", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "conversation_id"
    t.uuid     "owner_id"
    t.string   "title",              null: false
    t.string   "status",             default: "open", null: false
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "archive_number"
    t.datetime "archived_at"
    t.integer  "deliverables_count", default: 0,      null: false
  end
  add_index "agenda_items", ["conversation_id"], name: "index_agenda_items_on_conversation_id", using: :btree
  add_index "agenda_items", ["created_at"], name: "index_agenda_items_on_created_at", order: {"created_at"=>:desc}, using: :btree
  add_index "agenda_items", ["owner_id"], name: "index_agenda_items_on_owner_id", using: :btree

  create_table "comments", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "commentable_id"
    t.uuid     "author_id"
    t.text     "body"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "commentable_type", default: "Conversation"
    t.string   "archive_number"
    t.datetime "archived_at"
  end
  add_index "comments", ["author_id"], name: "index_comments_on_author_id", using: :btree
  add_index "comments", ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id", using: :btree
  add_index "comments", ["created_at"], name: "index_comments_on_created_at", order: {"created_at"=>:desc}, using: :btree

  create_table "conversation_members", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "conversation_id"
    t.uuid     "member_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end
  add_index "conversation_members", ["conversation_id", "member_id"], name: "index_conversation_members_on_conversation_id_and_member_id", unique: true, using: :btree
  add_index "conversation_members", ["conversation_id"], name: "index_conversation_members_on_conversation_id", using: :btree
  add_index "conversation_members", ["member_id"], name: "index_conversation_members_on_member_id", using: :btree

  create_table "deliverables", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "agenda_item_id"
    t.uuid     "owner_id",       null: false
    t.string   "title",          null: false
    t.text     "description"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.uuid     "assignee_id",    null: false
    t.date     "due_on"
    t.string   "status",         default: "open", null: false
    t.string   "archive_number"
    t.datetime "archived_at"
  end
  add_index "deliverables", ["agenda_item_id"], name: "index_deliverables_on_agenda_item_id", using: :btree
  add_index "deliverables", ["owner_id"], name: "index_deliverables_on_owner_id", using: :btree

  create_view "conversation_objects", <<-'END_VIEW_CONVERSATION_OBJECTS', :force => true
SELECT comments.id,
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
    NULL::character varying AS status,
    NULL::uuid AS agenda_item_id,
    NULL::text AS description,
    NULL::uuid AS assignee_id,
    NULL::date AS due_on,
    comments.archive_number,
    comments.archived_at,
    NULL::integer AS deliverables_count
   FROM comments
UNION ALL
 SELECT agenda_items.id,
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
    agenda_items.deliverables_count
   FROM agenda_items
UNION ALL
 SELECT deliverables.id,
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
    NULL::integer AS deliverables_count
   FROM deliverables
  END_VIEW_CONVERSATION_OBJECTS

  create_table "conversations", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.string   "title",           null: false
    t.uuid     "organization_id", null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end
  add_index "conversations", ["organization_id"], name: "index_conversations_on_organization_id", using: :btree

  create_table "organization_members", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "organization_id"
    t.uuid     "member_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end
  add_index "organization_members", ["member_id"], name: "index_organization_members_on_member_id", using: :btree
  add_index "organization_members", ["organization_id", "member_id"], name: "index_organization_members_on_organization_id_and_member_id", unique: true, using: :btree
  add_index "organization_members", ["organization_id"], name: "index_organization_members_on_organization_id", using: :btree

  create_table "organizations", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.string   "name",       null: false
    t.text     "mission"
    t.uuid     "owner_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
  add_index "organizations", ["owner_id"], name: "index_organizations_on_owner_id", using: :btree

  create_table "unseen_objects", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.uuid     "organization_id"
    t.uuid     "conversation_id"
    t.uuid     "agenda_item_id"
    t.uuid     "deliverable_id"
    t.uuid     "target_id"
    t.string   "target_type"
    t.uuid     "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end
  add_index "unseen_objects", ["agenda_item_id"], name: "index_unseen_objects_on_agenda_item_id", using: :btree
  add_index "unseen_objects", ["conversation_id"], name: "index_unseen_objects_on_conversation_id", using: :btree
  add_index "unseen_objects", ["deliverable_id"], name: "index_unseen_objects_on_deliverable_id", using: :btree
  add_index "unseen_objects", ["organization_id"], name: "index_unseen_objects_on_organization_id", using: :btree
  add_index "unseen_objects", ["target_type", "target_id"], name: "index_unseen_objects_on_target_type_and_target_id", using: :btree
  add_index "unseen_objects", ["user_id"], name: "index_unseen_objects_on_user_id", using: :btree

  create_table "users", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.string   "invited_by_type"
    t.uuid     "invited_by_id"
    t.integer  "invitations_count",      default: 0
    t.string   "presence_status"
  end
  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["invitation_token"], name: "index_users_on_invitation_token", unique: true, using: :btree
  add_index "users", ["invitations_count"], name: "index_users_on_invitations_count", using: :btree
  add_index "users", ["invited_by_id"], name: "index_users_on_invited_by_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

  add_foreign_key "agenda_items", "conversations", on_delete: :cascade
  add_foreign_key "agenda_items", "users", column: "owner_id"
  add_foreign_key "comments", "users", column: "author_id"
  add_foreign_key "conversation_members", "conversations"
  add_foreign_key "conversation_members", "users", column: "member_id"
  add_foreign_key "conversations", "organizations"
  add_foreign_key "deliverables", "agenda_items", on_delete: :cascade
  add_foreign_key "deliverables", "users", column: "assignee_id"
  add_foreign_key "deliverables", "users", column: "owner_id"
  add_foreign_key "organization_members", "organizations"
  add_foreign_key "organization_members", "users", column: "member_id"
  add_foreign_key "organizations", "users", column: "owner_id"
  add_foreign_key "unseen_objects", "agenda_items"
  add_foreign_key "unseen_objects", "conversations"
  add_foreign_key "unseen_objects", "deliverables"
  add_foreign_key "unseen_objects", "organizations"
  add_foreign_key "unseen_objects", "users"
end
