class DeliverableSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :due_on, :created_at, :updated_at, :comments_count, :archived, :archived_at
  belongs_to :parent
  belongs_to :owner
  belongs_to :assignee
end
