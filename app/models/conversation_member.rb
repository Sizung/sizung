class ConversationMember < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'

  validates :member_id, uniqueness: {scope: :conversation_id}
end
