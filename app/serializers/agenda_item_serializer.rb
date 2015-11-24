class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :created_at, :updated_at, :comments_count
  belongs_to :conversation
  belongs_to :owner
end
