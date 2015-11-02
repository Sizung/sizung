class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title
  belongs_to :conversation
  belongs_to :owner
end
