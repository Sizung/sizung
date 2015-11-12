class DeliverableSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at, :updated_at, :comments_count
  belongs_to :agenda_item
  belongs_to :owner
end
