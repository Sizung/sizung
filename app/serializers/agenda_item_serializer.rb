class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at
  belongs_to :conversation
  belongs_to :owner
  has_many :conversation_objects
end
