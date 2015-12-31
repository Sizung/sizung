class UnseenObjectSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at
  belongs_to :organization
  belongs_to :conversation
  belongs_to :agenda_item
  belongs_to :deliverable
  belongs_to :target
  belongs_to :user
end
