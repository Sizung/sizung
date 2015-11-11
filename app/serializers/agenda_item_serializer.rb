class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at, :updated_at, :comments_count
  belongs_to :conversation
  belongs_to :owner
end
