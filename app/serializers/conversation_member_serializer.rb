class ConversationMemberSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :conversation
  belongs_to :member
end
