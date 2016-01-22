class DeliverableSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :due_on, :created_at, :updated_at, :comments_count, :archived
  belongs_to :agenda_item
  belongs_to :owner
  belongs_to :assignee
end
