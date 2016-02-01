class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at, :updated_at
  has_many :agenda_items
  has_many :deliverables
  has_many :conversation_members
  has_many :members
  belongs_to :organization
end
