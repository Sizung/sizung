class AgendaItemSerializer < ActiveModel::Serializer
  attributes :id, :title
  belongs_to :conversation
  belongs_to :owner
  has_one :initial_comment
end
